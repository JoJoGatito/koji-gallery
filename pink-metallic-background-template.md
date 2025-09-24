# Pink Metallic Background Template

This template documents the CSS implementation of the pink metallic background effect found in your project. It uses layered background images, CSS variables for colors, and blend modes to create a sparkly, metallic appearance.

## CSS Variables (Color Palette)

```css
:root {
  --black: #5b3a53;
  --dark: #a63356;
  --med: #ef5077;
  --pink: #FD94BD;
  --gray: #a58292;
  --light: #fdc6d3;
  --lighter: #FFDBEB;
  --white: #FFF3F4;
}
```

## Main Background Effect

Apply this to the `body` element for the full-page metallic background:

```css
body {
  background: 
    url('images/55e2f5316c62543c26248cd9f52cc8b8cb24d3db4b6d3749374ad8c59f6a7afe.png') repeat-x,
    url('images/79eef6bfc37e82169d2f4fa9ba3634121d65d2aa34536d22dead90178a7df76e.png') repeat-x,
    url('images/8e31b1e60162077db8e6a8636a23127bac5786e50ade4f26e6ca3c2fbe515d67.gif') center/5px,
    url('images/3448b8010dbb3c315ba742ec150ecd9541b93c4a234fa13e21299dc6d0af3fbb.png') center/contain,
    var(--light);
  background-attachment: fixed;
  background-blend-mode: normal;
}
```

### Background Properties Explained
- **Multiple layers**: Four image layers plus a base color layer
- **Repeat patterns**: First two layers use `repeat-x` for horizontal tiling
- **Positioning**: Center positioning with contain sizing for some layers
- **Attachment**: `fixed` keeps the effect stationary during scrolling
- **Base color**: `--light` (#fdc6d3) provides the pink foundation

## Additional Metallic Effects

For enhanced metallic appearance on specific elements:

```css
/* Example for a container or element */
.metallic-element {
  background-image: url('images/deafc3503248c1bad2c6f4cdc67f6eaba7adbda65f745136f865fae901158fa8.png');
  background-color: var(--pink);
  background-blend-mode: luminosity;
}
```

### Blend Modes for Metallic Effect
- `luminosity`: Creates the metallic sheen by blending light values
- `normal`: Standard blending for background layers

## Required Images

The following image files are referenced in the background layers:

1. `images/55e2f5316c62543c26248cd9f52cc8b8cb24d3db4b6d3749374ad8c59f6a7afe.png` - Horizontal repeating texture
2. `images/79eef6bfc37e82169d2f4fa9ba3634121d65d2aa34536d22dead90178a7df76e.png` - Secondary horizontal texture  
3. `images/8e31b1e60162077db8e6a8636a23127bac5786e50ade4f26e6ca3c2fbe515d67.gif` - Center sparkle pattern
4. `images/3448b8010dbb3c315ba742ec150ecd9541b93c4a234fa13e21299dc6d0af3fbb.png` - Central decorative element
5. `images/deafc3503248c1bad2c6f4cdc67f6eaba7adbda65f745136f865fae901158fa8.png` - Metallic texture overlay

## Usage Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Include the CSS variables and background rules above */
    body {
      /* Full metallic background */
    }
    
    .metallic-box {
      background-image: url('metallic-texture.png');
      background-color: var(--pink);
      background-blend-mode: luminosity;
      padding: 20px;
      color: var(--black);
    }
  </style>
</head>
<body>
  <div class="metallic-box">
    Content with metallic background effect
  </div>
</body>
</html>
```

## Tips for Customization
- Adjust the `--pink` and `--light` variables to change the base color
- Modify blend modes (multiply, screen, overlay) for different effects
- Replace image URLs with your own textures for custom metallic styles
- Use browser developer tools to experiment with different layer combinations

This template creates a sophisticated metallic background effect using CSS layering techniques rather than a single image file.