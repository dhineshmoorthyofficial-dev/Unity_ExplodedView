using UnityEngine;

[ExecuteAlways]
public class BoltUnscrew : MonoBehaviour
{
    public Vector3 axis = Vector3.forward; // Local axis to unscrew along
    public float distance = 1.0f;          // How far it moves out
    public float rotations = 5.0f;         // How many full turns
    public bool invertRotation = false;    // Reverse thread direction

    private Vector3 _originalLocalPos;
    private Quaternion _originalLocalRot;
    private bool _initialized = false;

    public void Init(Vector3 startPos, Quaternion startRot)
    {
        _originalLocalPos = startPos;
        _originalLocalRot = startRot;
        _initialized = true;
    }

    public void Animate(float factor)
    {
        if (!_initialized)
        {
            // Fallback if Init wasn't called manually (e.g. tested in isolation)
            // But ideally Manager calls Init to ensure specific "Closed" state is captured
            _originalLocalPos = transform.localPosition;
            _originalLocalRot = transform.localRotation;
            _initialized = true;
        }

        // Translation
        Vector3 moveDir = axis.normalized;
        transform.localPosition = _originalLocalPos + (moveDir * distance * factor);

        // Rotation
        // 360 degrees * number of rotations * factor
        float angle = 360f * rotations * factor;
        if (invertRotation) angle = -angle;

        Quaternion spin = Quaternion.AngleAxis(angle, axis);
        transform.localRotation = _originalLocalRot * spin;
    }

    // Comprehensive Visualization
    private void OnDrawGizmosSelected()
    {
        Vector3 worldAxis = transform.TransformDirection(axis.normalized);
        Vector3 startPos = _initialized ? transform.parent != null ? transform.parent.TransformPoint(_originalLocalPos) : _originalLocalPos : transform.position;
        Vector3 endPos = startPos + (worldAxis * distance);

        // 1. Draw the movement axis (thick cyan line)
        Gizmos.color = Color.cyan;
        Gizmos.DrawLine(startPos, endPos);
        
        // 2. Draw axis direction arrow at end
        DrawArrow(endPos, worldAxis, 0.1f, Color.cyan);
        
        // 3. Draw start position marker (green sphere)
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(startPos, 0.03f);
        
        // 4. Draw end position marker (red sphere)
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(endPos, 0.03f);
        
        // 5. Draw rotation spiral to visualize threading
        DrawRotationSpiral(startPos, endPos, worldAxis);
        
        // 6. Draw perpendicular circles at start and end to show rotation
        DrawRotationCircle(startPos, worldAxis, 0.05f, Color.green);
        DrawRotationCircle(endPos, worldAxis, 0.05f, Color.red);
    }

    private void DrawArrow(Vector3 pos, Vector3 direction, float size, Color color)
    {
        Gizmos.color = color;
        Vector3 right = Vector3.Cross(direction, Vector3.up).normalized;
        if (right == Vector3.zero) right = Vector3.Cross(direction, Vector3.right).normalized;
        Vector3 up = Vector3.Cross(right, direction).normalized;
        
        Vector3 arrowTip = pos;
        Vector3 arrowBase = pos - direction * size;
        
        Gizmos.DrawLine(arrowBase, arrowTip);
        Gizmos.DrawLine(arrowTip, arrowBase + (right + direction) * size * 0.3f);
        Gizmos.DrawLine(arrowTip, arrowBase + (-right + direction) * size * 0.3f);
    }

    private void DrawRotationSpiral(Vector3 start, Vector3 end, Vector3 axis)
    {
        int segments = 50;
        float totalAngle = rotations * 360f * (invertRotation ? -1f : 1f);
        
        Vector3 perpendicular = Vector3.Cross(axis, Vector3.up).normalized;
        if (perpendicular == Vector3.zero) perpendicular = Vector3.Cross(axis, Vector3.right).normalized;
        
        Vector3 lastPoint = start + perpendicular * 0.05f;
        
        for (int i = 1; i <= segments; i++)
        {
            float t = i / (float)segments;
            Vector3 centerPoint = Vector3.Lerp(start, end, t);
            float angle = totalAngle * t;
            
            Quaternion rotation = Quaternion.AngleAxis(angle, axis);
            Vector3 offset = rotation * perpendicular * 0.05f;
            Vector3 point = centerPoint + offset;
            
            // Color gradient from yellow to orange
            Gizmos.color = Color.Lerp(Color.yellow, new Color(1f, 0.5f, 0f), t);
            Gizmos.DrawLine(lastPoint, point);
            lastPoint = point;
        }
    }

    private void DrawRotationCircle(Vector3 center, Vector3 normal, float radius, Color color)
    {
        Gizmos.color = color;
        Vector3 perpendicular = Vector3.Cross(normal, Vector3.up).normalized;
        if (perpendicular == Vector3.zero) perpendicular = Vector3.Cross(normal, Vector3.right).normalized;
        
        int segments = 20;
        Vector3 lastPoint = center + perpendicular * radius;
        
        for (int i = 1; i <= segments; i++)
        {
            float angle = (i / (float)segments) * 360f;
            Quaternion rotation = Quaternion.AngleAxis(angle, normal);
            Vector3 point = center + rotation * (perpendicular * radius);
            Gizmos.DrawLine(lastPoint, point);
            lastPoint = point;
        }
    }
}
