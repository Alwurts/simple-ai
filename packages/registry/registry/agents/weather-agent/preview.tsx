export default function WeatherAgentPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-6">
      <p className="font-medium">Weather agent</p>
      <p className="text-muted-foreground text-sm">
        ToolLoopAgent with a <code>getWeather</code> tool. Add with{" "}
        <code>@simple-ai/weather-agent</code>, then an API block.
      </p>
    </div>
  );
}
