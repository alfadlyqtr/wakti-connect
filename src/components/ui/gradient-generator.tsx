
import { Copy, Minus, Plus, RotateCw } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";

export const GradientGenerator = () => {
  const [colors, setColors] = useState<string[]>(["#4f46e5", "#0ea5e9"]);
  const [angle, setAngle] = useState<number>(90);

  const addColor = () => {
    setColors([...colors, "#000000"]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const generateGradient = () => {
    return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
  };

  const resetGradient = () => {
    setColors(["#4f46e5", "#0ea5e9"]);
    setAngle(90);
  };

  const copyGradientCSS = () => {
    navigator.clipboard.writeText(
      `background: ${generateGradient()};`
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div
        className="mb-8 h-48 rounded-lg"
        style={{ background: generateGradient() }}
      />

      <div className="mb-6 space-y-4">
        <div>
          <Label>Gradient Colors</Label>
          <div className="mt-2 space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-32"
                />
                {colors.length > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeColor(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addColor}
            className="mt-2"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Color
          </Button>
        </div>

        <div>
          <Label>Angle: {angle}°</Label>
          <Slider
            value={[angle]}
            onValueChange={([value]) => setAngle(value)}
            max={360}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={copyGradientCSS}>
            <Copy className="mr-1 h-4 w-4" />
            Copy CSS
          </Button>
          <Button variant="outline" onClick={resetGradient}>
            <RotateCw className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
