
import { Copy, Minus, Plus, RotateCw, Shuffle, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Switch } from "./switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export const GradientGenerator = () => {
  const [colors, setColors] = useState<string[]>(["#4f46e5", "#0ea5e9"]);
  const [angle, setAngle] = useState<number>(90);
  const [gradientType, setGradientType] = useState<string>("linear");
  const [noiseOpacity, setNoiseOpacity] = useState<number>(0);
  const [gradientPosition, setGradientPosition] = useState<string>("center");
  const [showCode, setShowCode] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const generateRandomColors = () => {
    const getRandomColor = () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };
    
    const randomColors = Array(colors.length).fill(null).map(() => getRandomColor());
    setColors(randomColors);
  };

  const generateGradient = () => {
    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
    } else {
      return `radial-gradient(circle at ${gradientPosition}, ${colors.join(", ")})`;
    }
  };

  const resetGradient = () => {
    setColors(["#4f46e5", "#0ea5e9"]);
    setAngle(90);
    setGradientType("linear");
    setNoiseOpacity(0);
    setGradientPosition("center");
  };

  const copyGradientCSS = () => {
    let css = `background: ${generateGradient()};`;
    
    if (noiseOpacity > 0) {
      css += `\nbackground-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${noiseOpacity}'/%3E%3C/svg%3E"), ${generateGradient()};`;
    }
    
    navigator.clipboard.writeText(css);
  };

  const downloadGradient = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630;
    
    // Create gradient
    let gradient;
    if (gradientType === "linear") {
      gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    } else {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      gradient = context.createRadialGradient(
        centerX, centerY, 0, 
        centerX, centerY, canvas.width / 1.5
      );
    }
    
    // Add color stops
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise if needed
    if (noiseOpacity > 0) {
      // Simple noise implementation
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255 * noiseOpacity;
        data[i] = Math.min(255, data[i] + noise);
        data[i + 1] = Math.min(255, data[i + 1] + noise);
        data[i + 2] = Math.min(255, data[i + 2] + noise);
      }
      context.putImageData(imageData, 0, 0);
    }
    
    // Convert to image and download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'gradient.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div
        className="mb-8 h-48 rounded-lg transition-all duration-300 shadow-md"
        style={{ 
          background: generateGradient(),
          backgroundImage: noiseOpacity > 0 
            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${noiseOpacity}'/%3E%3C/svg%3E"), ${generateGradient()}`
            : undefined
        }}
      />

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <Tabs defaultValue="colors" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="type">Type & Angle</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-3">
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
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addColor}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Color
            </Button>
            <Button 
              variant="outline"
              onClick={generateRandomColors}
            >
              <Shuffle className="mr-1 h-4 w-4" />
              Random
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="type" className="space-y-4">
          <div className="space-y-2">
            <Label>Gradient Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={gradientType === "linear" ? "default" : "outline"}
                onClick={() => setGradientType("linear")}
                className="justify-start"
              >
                Linear
              </Button>
              <Button 
                variant={gradientType === "radial" ? "default" : "outline"}
                onClick={() => setGradientType("radial")}
                className="justify-start"
              >
                Radial
              </Button>
            </div>
          </div>

          {gradientType === "linear" ? (
            <div className="space-y-2">
              <Label>Angle: {angle}°</Label>
              <Slider
                value={[angle]}
                onValueChange={([value]) => setAngle(value)}
                max={360}
                step={1}
                className="mt-2"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Position</Label>
              <Select
                value={gradientPosition}
                onValueChange={setGradientPosition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="top right">Top Right</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="bottom right">Bottom Right</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="bottom left">Bottom Left</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="top left">Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Noise Texture</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(noiseOpacity * 100)}%
              </span>
            </div>
            <Slider
              value={[noiseOpacity]}
              onValueChange={([value]) => setNoiseOpacity(value)}
              max={1}
              step={0.01}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-code">Show CSS</Label>
            <Switch 
              id="show-code" 
              checked={showCode}
              onCheckedChange={setShowCode}
            />
          </div>
        </TabsContent>
      </Tabs>

      {showCode && (
        <div className="mb-6 p-4 bg-black/5 rounded-md">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            <code>
              {`background: ${generateGradient()};`}
              {noiseOpacity > 0 && `\nbackground-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${noiseOpacity}'/%3E%3C/svg%3E"), ${generateGradient()};`}
            </code>
          </pre>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button onClick={copyGradientCSS}>
          <Copy className="mr-1 h-4 w-4" />
          Copy CSS
        </Button>
        <Button variant="outline" onClick={resetGradient}>
          <RotateCw className="mr-1 h-4 w-4" />
          Reset
        </Button>
        <Button variant="outline" onClick={downloadGradient}>
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};
