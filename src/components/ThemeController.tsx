import { themes } from "src/constants";
import { useThemeStore } from "src/stores";

const ThemeController = () => {
  const { theme: themeStore, setTheme } = useThemeStore();
  return (
    <div>
      <div tabIndex={0} />
      <div className="dropdown">
        <div
          tabIndex={1}
          role="button"
          className="btn btn-ghost btn-sm m-1 px-1"
        >
          主題
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[100] w-52 rounded-box bg-base-300 p-2 shadow-2xl"
        >
          {themes.map((theme) => (
            <li key={theme}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
                aria-label={theme}
                value={theme}
                checked={theme === themeStore}
                onChange={(e) => {
                  if (e.target.checked) setTheme(theme);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeController;
