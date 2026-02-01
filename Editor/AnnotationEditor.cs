using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(Annotation))]
[CanEditMultipleObjects] // This allows editing multiple selected Annotations
public class AnnotationEditor : Editor
{
    public override void OnInspectorGUI()
    {
        // This helper handles the multi-editing data sync automatically
        serializedObject.Update();

        // Draw all default fields
        DrawDefaultInspector();

        // If you want special buttons, add them here
        if (GUILayout.Button("Manual Refresh Links"))
        {
            foreach (var targetObject in targets)
            {
                ((Annotation)targetObject).RefreshLinks();
            }
        }

        // Apply any changes made to the selected objects
        serializedObject.ApplyModifiedProperties();
    }
}