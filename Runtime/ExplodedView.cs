using System.Collections.Generic;
using UnityEngine;
[ExecuteAlways]
public class ExplodedView : MonoBehaviour
{
    public enum ExplosionMode { Spherical, Target }
    public ExplosionMode explosionMode = ExplosionMode.Spherical;

    [Range(0f, 1f)]
    public float explosionFactor = 0f;
    public float sensitivity = 1f;
    public Transform center;
    public bool useHierarchicalCenter = false;
    public bool autoGroupChildren = false;
    public bool drawDebugLines = false;
    public Color debugLineColor = Color.yellow;

    [System.Serializable]
    public class PartData
    {
        public Transform transform;
        public Vector3 originalLocalPosition;
        public Quaternion originalLocalRotation;
        public Vector3 originalLocalScale;
        public Vector3 direction; // Used for Spherical
        public Transform targetTransform; // Used for Target Mode
    }

    [SerializeField] // Serialize to keep data between reloads/play mode
    public List<PartData> parts = new List<PartData>();

    public PartData GetPartData(Transform t)
    {
        return parts.Find(p => p.transform == t);
    }

    [SerializeField]
    public List<ExplodedView> subManagers = new List<ExplodedView>();

    private void OnEnable()
    {
        // Only setup if we haven't already, or if the list is empty
        if (parts == null || parts.Count == 0 || subManagers == null)
        {
            SetupExplosion();
        }
    }

    [ContextMenu("Reset & Setup Explosion")]
    public void SetupExplosion()
    {
        if (autoGroupChildren)
        {
            AutoAttachSubManagers();
        }

        // --- Safe Setup Logic ---
        // Restore any existing parts to their home before re-scanning
        // This prevents capturing "already exploded" positions as the home state.
        foreach (var part in parts)
        {
            if (part != null && part.transform != null)
            {
                part.transform.localPosition = part.originalLocalPosition;
                part.transform.localRotation = part.originalLocalRotation;
                part.transform.localScale = part.originalLocalScale;
            }
        }
        explosionFactor = 0f;

        parts.Clear();
        subManagers.Clear();

        // 2. Recursively find "Significant Parts" to move
        // This stops at the first thing that is either a Renderer OR another manager.
        DiscoverParts(transform, center != null ? center.position : transform.position);
        
        Debug.Log($"ExplodedView ({gameObject.name}): Setup complete. Moving {parts.Count} parts locally. Master Control has {subManagers.Count} direct sub-managers.");
    }

    private void DiscoverParts(Transform current, Vector3 rootCenterPos)
    {
        foreach (Transform child in current)
        {
            bool isSignificant = false;

            // If child has another manager, it's a "significant part" (a group)
            ExplodedView childManager = child.GetComponent<ExplodedView>();
            if (childManager != null)
            {
                isSignificant = true;
                subManagers.Add(childManager);
                
                // Propagate mode to children
                childManager.explosionMode = this.explosionMode;
                childManager.SetupExplosion();
            }
            // Else if it has a renderer, it's a "significant part" (a leaf mesh)
            else if (child.GetComponent<Renderer>() != null)
            {
                isSignificant = true;
            }

            if (isSignificant)
            {
                AddPart(child, rootCenterPos);
            }
            else
            {
                DiscoverParts(child, rootCenterPos);
            }
        }
    }

    private void AddPart(Transform child, Vector3 rootCenterPos)
    {
        // Determine the center to explode from
        Vector3 centerForThisPart = rootCenterPos;
        if (useHierarchicalCenter && child.parent != null && child.parent != transform)
        {
            centerForThisPart = child.parent.position;
        }

        Vector3 worldDir = (child.position - centerForThisPart).normalized;
        if (worldDir == Vector3.zero) worldDir = Vector3.up;

        Vector3 localDir = child.parent != null ? child.parent.InverseTransformVector(worldDir) : worldDir;

        Transform targetT = null;
        if (explosionMode == ExplosionMode.Target)
        {
            targetT = SetupTargetObject(child, localDir);
        }

        parts.Add(new PartData
        {
            transform = child,
            originalLocalPosition = child.localPosition,
            originalLocalRotation = child.localRotation,
            originalLocalScale = child.localScale,
            direction = localDir,
            targetTransform = targetT
        });
    }

    public void InitializeTargetMode()
    {
        if (parts == null || parts.Count == 0) return;

        foreach (var part in parts)
        {
            if (part.targetTransform == null)
            {
                part.targetTransform = SetupTargetObject(part.transform, part.direction);
            }
        }
    }

    public void ClearTargets()
    {
        Transform container = transform.Find("ExplosionTargets");
        if (container != null)
        {
            DestroyImmediate(container.gameObject);
        }

        foreach (var part in parts)
        {
            part.targetTransform = null;
        }
    }

    private Transform SetupTargetObject(Transform child, Vector3 localDir)
    {
        // Look for existing target container
        Transform container = transform.Find("ExplosionTargets");
        if (container == null)
        {
            GameObject containerObj = new GameObject("ExplosionTargets");
            containerObj.transform.SetParent(transform, false);
            container = containerObj.transform;
        }

        string targetName = $"Target_{child.name}";
        Transform targetT = container.Find(targetName);
        if (targetT == null)
        {
            GameObject targetObj = new GameObject(targetName);
            targetT = targetObj.transform;
            targetT.SetParent(container, false);
            
            // Initial position: Offset slightly along the direction so it's visible/useful
            targetT.localPosition = child.localPosition + localDir * sensitivity;
            targetT.localRotation = child.localRotation;
            targetT.localScale = child.localScale;
        }

        return targetT;
    }

    private void Update()
    {
        if (parts == null || parts.Count == 0) return;
        
        foreach (var part in parts)
        {
            if (part == null || part.transform == null) continue;

            if (explosionMode == ExplosionMode.Spherical)
            {
                Vector3 displacement = part.direction * (explosionFactor * sensitivity);
                part.transform.localPosition = part.originalLocalPosition + displacement;
            }
            else if (explosionMode == ExplosionMode.Target && part.targetTransform != null)
            {
                part.transform.localPosition = Vector3.Lerp(part.originalLocalPosition, part.targetTransform.localPosition, explosionFactor);
                // Optional: Also lerp rotation/scale if needed, but per request let's focus on position
            }
        }
    }

    // Optional: Reset positions when disabled or destroyed to prevent "stuck" explosion
    private void OnDisable()
    {
        // ...
    }

    private void OnDestroy()
    {
        // If we are being removed in the editor, and not because of a scene close/playmode change
        if (!Application.isPlaying && this == null) 
        {
            Cleanup(false);
        }
    }

    public void Cleanup(bool removeComponent = false)
    {
        // 1. Reset all parts managed by THIS component
        foreach (var part in parts)
        {
            if (part != null && part.transform != null)
            {
                part.transform.localPosition = part.originalLocalPosition;
                part.transform.localRotation = part.originalLocalRotation;
                part.transform.localScale = part.originalLocalScale;
            }
        }

        // 2. Cleanup Targets
        Transform container = transform.Find("ExplosionTargets");
        if (container != null)
        {
            DestroyImmediate(container.gameObject);
        }

        // 3. Recursive Cleanup of Sub-Managers
        // Copy to list to avoid modification during iteration if we are destroying them
        List<ExplodedView> subs = new List<ExplodedView>(subManagers);
        foreach (var sub in subs)
        {
            if (sub != null)
            {
                sub.Cleanup(removeComponent);
            }
        }

        parts.Clear();
        subManagers.Clear();

        if (removeComponent)
        {
            // Use DelayCall to avoid "Destroying during OnDestroy" or similar issues if called from UI
            #if UNITY_EDITOR
            UnityEditor.EditorApplication.delayCall += () => {
                if (this != null) DestroyImmediate(this);
            };
            #else
            DestroyImmediate(this);
            #endif
        }
    }

    private void AutoAttachSubManagers()
    {
        // Smart Selection: Only add sub-managers to immediate children that are actually GROUPS.
        // A child is a group if it has its own children.
        // Single leaf nodes will remain managed by THIS (the root) component.
        foreach (Transform child in transform)
        {
            // If it has its own hierarchy and contains renderers
            // Optimization: Use GetComponentInChildren (singular) checks for existence without allocating array
            if (child.childCount > 0 && child.GetComponentInChildren<Renderer>() != null)
            {
                if (child.GetComponent<ExplodedView>() == null)
                {
                    ExplodedView newManager = child.gameObject.AddComponent<ExplodedView>();
                    
                    // Propagate settings to ensure seamless recursion
                    newManager.explosionFactor = this.explosionFactor;
                    newManager.sensitivity = this.sensitivity;
                    newManager.useHierarchicalCenter = this.useHierarchicalCenter;
                    newManager.autoGroupChildren = true;

                    // Trigger setup to continue the chain
                    newManager.SetupExplosion();
                    
                    Debug.Log($"ExplodedView: Auto-added group manager to: {child.name}");
                }
            }
        }
    }
}
