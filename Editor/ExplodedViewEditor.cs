using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

[CustomEditor(typeof(ExplodedView))]
[CanEditMultipleObjects]
public class ExplodedViewEditor : Editor
{
    private SerializedProperty explosionMode;
    private SerializedProperty explosionFactor;
    private SerializedProperty sensitivity;
    private SerializedProperty center;
    private SerializedProperty useHierarchicalCenter;
    private SerializedProperty autoGroupChildren;
    // We won't use the SerializedProperty for subManagers logic specifically, 
    // because we want to traverse the tree recursively via direct references.

    // Key: InstanceID, Value: IsExpanded. Static to persist between selections.
    private static Dictionary<int, bool> foldoutStates = new Dictionary<int, bool>();

    private void OnEnable()
    {
        explosionMode = serializedObject.FindProperty("explosionMode");
        explosionFactor = serializedObject.FindProperty("explosionFactor");
        sensitivity = serializedObject.FindProperty("sensitivity");
        center = serializedObject.FindProperty("center");
        useHierarchicalCenter = serializedObject.FindProperty("useHierarchicalCenter");
        autoGroupChildren = serializedObject.FindProperty("autoGroupChildren");
    }

    public override void OnInspectorGUI()
    {
        serializedObject.Update();

        EditorGUILayout.LabelField("Settings", EditorStyles.boldLabel);
        EditorGUILayout.PropertyField(explosionMode);
        
        EditorGUILayout.PropertyField(explosionFactor);
        EditorGUILayout.PropertyField(sensitivity);

        if ((ExplodedView.ExplosionMode)explosionMode.enumValueIndex == ExplodedView.ExplosionMode.Spherical)
        {
            EditorGUILayout.PropertyField(center);
            EditorGUILayout.PropertyField(useHierarchicalCenter);
        }
        
        EditorGUILayout.PropertyField(autoGroupChildren);
        
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.PropertyField(serializedObject.FindProperty("drawDebugLines"), new GUIContent("Draw Debug Lines"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("debugLineColor"), GUIContent.none, GUILayout.Width(50));
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.Space();

        ExplodedView root = (ExplodedView)target;

        if (root.subManagers != null && root.subManagers.Count > 0)
        {
            EditorGUILayout.LabelField("Master Control (Hierarchy)", EditorStyles.boldLabel);
            DrawSubManagersRecursive(root);
        }
        
        EditorGUILayout.Space();
        if (GUILayout.Button("Reset & Setup Explosion"))
        {
            foreach (var t in targets)
            {
                (t as ExplodedView).SetupExplosion();
            }
        }

        EditorGUILayout.Space();
        
        // --- Danger Zone ---
        GUI.backgroundColor = new Color(1f, 0.8f, 0.8f);
        bool showDanger = foldoutStates.ContainsKey(-999) ? foldoutStates[-999] : false;
        showDanger = EditorGUILayout.BeginFoldoutHeaderGroup(showDanger, "Danger Zone");
        foldoutStates[-999] = showDanger;
        
        if (showDanger)
        {
            EditorGUILayout.HelpBox("These actions will affect the entire hierarchy recursively.", MessageType.Warning);
            
            if (GUILayout.Button("Cleanup & Reset (Deletes Targets/Scripts)"))
            {
                if (EditorUtility.DisplayDialog("Exploded View Cleanup", "This will reset all part positions and delete all generated target objects/sub-managers. Continue?", "Yes", "Cancel"))
                {
                    foreach (var t in targets) (t as ExplodedView).Cleanup(false);
                }
            }

            GUI.backgroundColor = new Color(1f, 0.5f, 0.5f);
            if (GUILayout.Button("Deep Remove (Component + Children + Targets)"))
            {
                if (EditorUtility.DisplayDialog("Exploded View Deep Remove", "This will permanently remove the ExplodedView system and all generated objects from this hierarchy. Continue?", "Delete Everything", "Cancel"))
                {
                    foreach (var t in targets) (t as ExplodedView).Cleanup(true);
                }
            }
        }
        EditorGUILayout.EndFoldoutHeaderGroup();
        GUI.backgroundColor = Color.white;

        serializedObject.ApplyModifiedProperties();
    }

    private void DrawSubManagersRecursive(ExplodedView manager)
    {
        if (manager == null) return;
        
        bool isParentInTargetMode = manager.explosionMode == ExplodedView.ExplosionMode.Target;

        // 1. Draw Sub-Managers (Groups)
        if (manager.subManagers != null)
        {
            foreach (var sub in manager.subManagers)
            {
                if (sub == null) continue;

                int id = sub.GetInstanceID();
                bool isExpanded = foldoutStates.ContainsKey(id) ? foldoutStates[id] : false;

                EditorGUILayout.BeginVertical(EditorStyles.helpBox);

                // Header Row
                EditorGUILayout.BeginHorizontal();
                
                // Foldout for children
                bool hasSubChildManagers = sub.subManagers != null && sub.subManagers.Count > 0;
                bool hasLeafParts = false;
                // Check for leaf parts in sub to see if we should show foldout
                foreach(var p in sub.parts) {
                    if (p.transform != null && p.transform.GetComponent<ExplodedView>() == null) {
                        hasLeafParts = true;
                        break;
                    }
                }

                if (hasSubChildManagers || hasLeafParts)
                {
                    bool newExpanded = EditorGUILayout.Foldout(isExpanded, sub.gameObject.name, true);
                    if (newExpanded != isExpanded)
                    {
                        foldoutStates[id] = newExpanded;
                    }
                }
                else
                {
                    EditorGUILayout.LabelField(sub.gameObject.name, EditorStyles.boldLabel);
                }

                if (GUILayout.Button("Select", GUILayout.Width(60)))
                {
                    Selection.activeGameObject = sub.gameObject;
                }
                EditorGUILayout.EndHorizontal();

                // Controls for THIS sub-manager
                EditorGUI.BeginChangeCheck();
                ExplodedView.ExplosionMode subMode = (ExplodedView.ExplosionMode)EditorGUILayout.EnumPopup("Mode", sub.explosionMode);
                float newFactor = EditorGUILayout.Slider("Explosion", sub.explosionFactor, 0f, 1f);
                float newSensitivity = EditorGUILayout.FloatField("Sensitivity", sub.sensitivity);

                if (EditorGUI.EndChangeCheck())
                {
                    Undo.RecordObject(sub, "Change Sub-Manager Settings");
                    sub.explosionMode = subMode;
                    sub.explosionFactor = newFactor;
                    sub.sensitivity = newSensitivity;
                    EditorUtility.SetDirty(sub);
                }

                // NEW: Show Target Reference (Endpoint) from the parent's perspective
                if (isParentInTargetMode)
                {
                    var partData = manager.GetPartData(sub.transform);
                    if (partData != null)
                    {
                        EditorGUI.BeginChangeCheck();
                        Transform newTarget = (Transform)EditorGUILayout.ObjectField("Endpoint", partData.targetTransform, typeof(Transform), true);
                        if (EditorGUI.EndChangeCheck())
                        {
                            Undo.RecordObject(manager, "Change Target Reference");
                            partData.targetTransform = newTarget;
                            EditorUtility.SetDirty(manager);
                        }
                    }
                }

                if (sub.explosionMode == ExplodedView.ExplosionMode.Target)
                {
                    EditorGUILayout.BeginHorizontal();
                    
                    // Check if we need to create targets (if any part is missing one)
                    bool needsTargets = false;
                    foreach(var p in sub.parts) if(p.targetTransform == null) { needsTargets = true; break; }

                    if (needsTargets)
                    {
                        if (GUILayout.Button("Create Targets", EditorStyles.miniButton))
                        {
                            Undo.RecordObject(sub, "Create Targets");
                            sub.InitializeTargetMode();
                            EditorUtility.SetDirty(sub);
                        }
                    }

                    if (GUILayout.Button("Select All Targets", EditorStyles.miniButton))
                    {
                        Transform container = sub.transform.Find("ExplosionTargets");
                        if (container != null)
                        {
                            List<GameObject> targetObjects = new List<GameObject>();
                            foreach (Transform t in container) targetObjects.Add(t.gameObject);
                            Selection.objects = targetObjects.ToArray();
                        }
                    }

                    GUI.backgroundColor = new Color(1f, 0.7f, 0.7f);
                    if (GUILayout.Button("Delete Targets", EditorStyles.miniButton))
                    {
                        if (EditorUtility.DisplayDialog("Delete Targets", $"Delete all target objects for {sub.name}?", "Yes", "Cancel"))
                        {
                            Undo.RecordObject(sub, "Delete Targets");
                            sub.ClearTargets();
                            EditorUtility.SetDirty(sub);
                        }
                    }
                    GUI.backgroundColor = Color.white;
                    
                    EditorGUILayout.EndHorizontal();
                }

                // Recursive Draw Children if expanded
                if (foldoutStates.ContainsKey(id) && foldoutStates[id])
                {
                    EditorGUI.indentLevel++;
                    DrawSubManagersRecursive(sub);
                    EditorGUI.indentLevel--;
                }

                EditorGUILayout.EndVertical();
            }
        }

        // 2. Draw Leaf Parts (Renderers without Managers)
        foreach (var part in manager.parts)
        {
            if (part == null || part.transform == null) continue;
            if (part.transform.GetComponent<ExplodedView>() != null) continue; // Skip managers, they are handled above

            EditorGUILayout.BeginVertical(GUI.skin.box);
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField(part.transform.name, EditorStyles.miniLabel);
            if (GUILayout.Button("Select", GUILayout.Width(50))) Selection.activeGameObject = part.transform.gameObject;
            EditorGUILayout.EndHorizontal();

            if (isParentInTargetMode)
            {
                EditorGUI.BeginChangeCheck();
                Transform newTarget = (Transform)EditorGUILayout.ObjectField("Endpoint", part.targetTransform, typeof(Transform), true);
                if (EditorGUI.EndChangeCheck())
                {
                    Undo.RecordObject(manager, "Change Target Reference");
                    part.targetTransform = newTarget;
                    EditorUtility.SetDirty(manager);
                }
            }
            EditorGUILayout.EndVertical();
        }
    }

    private void OnSceneGUI()
    {
        ExplodedView root = (ExplodedView)target;
        if (root == null || !root.drawDebugLines) return;

        Handles.color = root.debugLineColor;
        DrawDebugLinesRecursive(root);
    }

    private void DrawDebugLinesRecursive(ExplodedView manager)
    {
        if (manager == null) return;

        foreach (var part in manager.parts)
        {
            if (part == null || part.transform == null) continue;

            Vector3 startPos = part.transform.parent != null 
                ? part.transform.parent.TransformPoint(part.originalLocalPosition) 
                : part.originalLocalPosition;
            
            Vector3 endPos = startPos;

            if (manager.explosionMode == ExplodedView.ExplosionMode.Spherical)
            {
                Vector3 worldDir = part.transform.parent != null 
                    ? part.transform.parent.TransformVector(part.direction) 
                    : part.direction;
                endPos = startPos + worldDir * manager.sensitivity;
            }
            else if (manager.explosionMode == ExplodedView.ExplosionMode.Target && part.targetTransform != null)
            {
                endPos = part.targetTransform.position;
            }

            Handles.DrawDottedLine(startPos, endPos, 4f);
            Handles.SphereHandleCap(0, startPos, Quaternion.identity, 0.05f * HandleUtility.GetHandleSize(startPos), EventType.Repaint);
            Handles.ArrowHandleCap(0, endPos, manager.explosionMode == ExplodedView.ExplosionMode.Spherical 
                ? Quaternion.LookRotation(endPos - startPos) 
                : Quaternion.identity, 0.2f * HandleUtility.GetHandleSize(endPos), EventType.Repaint);
        }

        if (manager.subManagers != null)
        {
            foreach (var sub in manager.subManagers)
            {
                if (sub != null) DrawDebugLinesRecursive(sub);
            }
        }
    }
}
