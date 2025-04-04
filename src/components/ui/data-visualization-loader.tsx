
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataVisualizationLoaderProps {
  data: any[] | null;
  isLoading: boolean;
  type?: 'bar' | 'line' | 'pie';
  dataKey: string;
  height?: number;
  animationDuration?: number;
}

export function DataVisualizationLoader({
  data,
  isLoading,
  type = 'bar',
  dataKey,
  height = 300,
  animationDuration = 1000
}: DataVisualizationLoaderProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  
  // Animation effect for data visualization
  useEffect(() => {
    if (!isLoading && data) {
      // Reset the animated data
      setAnimatedData([]);
      
      // Gradually reveal the data for animation effect
      const animateData = () => {
        const interval = animationDuration / data.length;
        
        data.forEach((item, index) => {
          setTimeout(() => {
            setAnimatedData(prev => [...prev, item]);
          }, index * interval);
        });
      };
      
      // Start the animation
      animateData();
    }
  }, [data, isLoading, animationDuration]);

  if (isLoading) {
    return (
      <div className="w-full" style={{ height: `${height}px` }}>
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={animatedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              border: '1px solid #ccc',
              borderRadius: '6px' 
            }} 
          />
          <Bar 
            dataKey={dataKey} 
            fill="#7c3aed" 
            radius={[4, 4, 0, 0]} 
            animationDuration={500}
            animationBegin={0}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
