// src/components/LogoMark.tsx

// Make sure your logo files are in the `public` folder
const logoLightSrc = '/logo-light.svg'; // The logo for light mode (usually dark)
const logoDarkSrc = '/logo-dark.svg';   // The logo for dark mode (usually light)

export function LogoMark() {
  return (
    <>
      {/* Light Mode Logo: Visible by default, hidden in dark mode */}
      <img
        src={logoLightSrc}
        alt="Paynvo Logo"
        className="block dark:hidden h-9 " // `block` makes it visible, `dark:hidden` hides it
      />
      {/* Dark Mode Logo: Hidden by default, visible in dark mode */}
      <img
        src={logoDarkSrc}
        alt="Paynvo Logo"
        className="hidden dark:block h-9 " // `hidden` hides it, `dark:block` shows it
      />
    </>
  );
}