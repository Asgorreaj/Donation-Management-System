import {Spinner} from "@nextui-org/react";
import {useTheme} from "next-themes";

const CustomLoader = () => {
  const { resolvedTheme } = useTheme();// Determine the current theme

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="text-center">
        <Spinner size="lg" color={resolvedTheme === "dark" ? "primary" : "secondary"} />
        <p className={`mt-4 ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default CustomLoader;
