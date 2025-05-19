# Real-time WCAG Contrast Checker

This project is a simple web application that allows users to select a foreground and a background color and instantly see the calculated contrast ratio between them. It also indicates whether the contrast meets Web Content Accessibility Guidelines (WCAG) 2.1 AA and AAA levels for normal and large text.

## Features

*   Select foreground color using a color picker or by typing a hex code.
*   Select background color using a color picker or by typing a hex code.
*   Real-time display of the calculated contrast ratio.
*   Indication of WCAG 2.1 AA compliance for normal and large text.
*   Indication of WCAG 2.1 AAA compliance for normal and large text.
*   Example text displayed with the selected colors for visual feedback.

## How It Works (The Math Behind It)

The contrast ratio calculation is based on the [WCAG 2.1 definition](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio). Here's a breakdown of the mathematical steps involved:

**1. Color Input (Hex to RGB)**

*   Colors are typically input as hexadecimal strings (e.g., `#336699` or `#F00`).
*   These hex strings are first parsed into their Red (R), Green (G), and Blue (B) components. Each component will be an integer value between 0 and 255.
    *   Example: `#FF8800` -> R=255, G=136, B=0

**2. Calculate Relative Luminance (L) for Each Color**

Relative luminance (L) is a measure of the perceived brightness of a color. It's a value between 0 (pure black) and 1 (pure white). This calculation is done for both the foreground and background colors.

   **a. Normalize RGB values:**
      Divide each R, G, B component by 255 to get values between 0 and 1.
      *   `R_sRGB = R / 255`
      *   `G_sRGB = G / 255`
      *   `B_sRGB = B / 255`

   **b. Linearize the sRGB values:**
      Computer displays don't output light linearly with the input signal (this is related to "gamma"). To get values proportional to actual light intensity, we apply the sRGB inverse companding function:
      For each component `C` (which is `R_sRGB`, `G_sRGB`, or `B_sRGB`):
      *   If `C <= 0.03928` then `C_linear = C / 12.92`
      *   Else (`C > 0.03928`) then `C_linear = ((C + 0.055) / 1.055) ^ 2.4`
      This gives us `R_linear`, `G_linear`, and `B_linear`.

   **c. Calculate Relative Luminance (L):**
      The linearized components are weighted according to human eye sensitivity (we perceive green as brightest) and summed:
      *   `L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear`

**3. Calculate the Contrast Ratio**

Once you have the relative luminance for the foreground color (`L_fg`) and the background color (`L_bg`):

   **a. Identify Lighter and Darker Luminances:**
      *   Let `L1` be the relative luminance of the *lighter* of the two colors (`max(L_fg, L_bg)`).
      *   Let `L2` be the relative luminance of the *darker* of the two colors (`min(L_fg, L_bg)`).

   **b. Apply the Contrast Ratio Formula:**
      *   `Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)`
      The `+ 0.05` term is added to both numerator and denominator. This accounts for perceived contrast in typical viewing conditions (ambient light/flare) and prevents division by zero if one color is pure black (L=0).

**4. Compare with WCAG Standards**

The calculated contrast ratio is then compared against WCAG thresholds:

*   **AA Level (Minimum Compliance):**
    *   Normal text (<18pt or <14pt bold): **4.5:1**
    *   Large text (>=18pt or >=14pt bold): **3:1**
*   **AAA Level (Enhanced Compliance):**
    *   Normal text: **7:1**
    *   Large text: **4.5:1**

The application displays whether these thresholds are met.

## Files

*   `index.html`: The main HTML structure of the application.
*   `style.css`: CSS for styling the application.
*   `script.js`: Contains the JavaScript logic, including the color parsing, luminance calculation, contrast ratio calculation, and UI updates.

## How to Run

1.  Clone or download the project files.
2.  Open `index.html` in a modern web browser.
3.  Use the color pickers or text inputs to select foreground and background colors.
4.  The contrast ratio and WCAG compliance levels will update automatically.

## Future Improvements

*   Support for RGBa (alpha transparency) for the foreground color, calculating contrast against a composited background.
*   Parsing `rgb()` and `hsl()` color strings.
*   Saving color palettes.
*   Offering color suggestions to meet compliance.