# Exploded View Tool - User Manual

## Introduction

Welcome to the **Exploded View Tool**! This Unity tool allows you to easily create impressive exploded view animations and visualizations for your 3D models. Whether you want to show the inner workings of a machine or just create a cool breakdown effect, this tool makes it simple.

### What can this package do?
*   **Spherical Explosion**: Move all parts straight out from a center point (like a "big bang").
*   **Targeted Explosion**: Manually tell each part exactly where to go for precise control.
*   **Nested Groups**: Handle complex objects with "parts inside parts" easily.
*   **Safe Reversible**: Your original object layout is always safe. You can reset at any time.

---

## Installation

1.  Import the package into your Unity project.
2.  That's it! The tool is ready to use.

---

## Quick Start Guide

1.  **Add the Component**: Select the parent GameObject of your model in the Scene hierarchy.
2.  **Add Script**: Click `Add Component` in the Inspector and search for `Exploded View`.
3.  **Setup**: Click the `Reset & Setup Explosion` button in the script component.
    *   *This will automatically find all the parts of your model.*
4.  **Explode!**: Drag the **Explosion Factor** slider from `0` to `1` to see your model explode.

---

## Modes Explained

### 1. Spherical Mode (Default)
Best for: Simple objects, debris, or quick visualizations.
*   **How it works**: Parts move away from a central point.
*   **Controls**:
    *   `Sensitivity`: Controls how far parts fly out.
    *   `Center`: (Optional) Drag a Transform here to change the center of the explosion.

### 2. Target Mode
Best for: Technical diagrams, assembly instructions, or precise animations.
*   **How it works**: You define a specific "End Position" for each part.
*   **Usage**:
    1.  Switch **Explosion Mode** to `Target`.
    2.  Click **Create Targets** if they don't exist.
    3.  You will see new "Ghost" objects appear (Target_ObjectName).
    4.  **Move the Ghost objects** to where you want the parts to end up.
    5.  Now, the **Explosion Factor** slider will animate parts smoothly from their start position to your custom target position.

---

## Advanced Features

*   **Sub-Managers (Nested Groups)**: If you have a car engine, you can have one ExplodedView on the "Engine" and another on the "Piston". Exploding the engine will move the whole piston, but you can *also* explode the piston itself separately!
*   **Auto-Grouping**: Enable `Auto Group Children` to automatically detect sub-asssemblies and add scripts to them.

---

## FAQ

**Q: My parts aren't moving!**
A: Make sure you clicked "Reset & Setup Explosion". The tool needs to scan your object first.

**Q: Can I undo the explosion?**
A: Yes! Just set **Explosion Factor** back to `0`. Your object returns to its original state.

**Q: How do I remove the tool?**
A: **Do not just delete the script.** scroll down to the "Danger Zone" in the inspector and click **Deep Remove**. This ensures all helper scripts and temporary target objects are cleaned up properly.
