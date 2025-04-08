
import React, { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getStaffPerformanceData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TeamActivityChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getStaffPerformanceData();
        
        // Format data for the chart
        const formattedData = data.labels.map((name, index) => ({
          name: isMobile ? name.split(' ')[0] : name, // Only first name on mobile
          "Hours Worked": data.datasets[0].data[index],
        }));
        
        setChartData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error loading staff performance data:", err);
        setError(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isMobile, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>{t("common.loading")}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p>{t("dashboard.noStaffActivity")}</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <BarChart 
        data={chartData} 
        margin={{ 
          top: 20, 
          right: isMobile ? 15 : 30, 
          left: isMobile ? 15 : 20, 
          bottom: isMobile ? 50 : 5 
        }}
        barSize={isMobile ? 25 : 40}
      >
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: isMobile ? 11 : 12 }}
          tickMargin={isMobile ? 5 : 5}
          angle={isMobile ? -30 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 60 : 30}
          interval={0}
        />
        <YAxis 
          tick={{ fontSize: isMobile ? 11 : 12 }}
          width={isMobile ? 35 : 40}
        />
        <Tooltip 
          contentStyle={{ fontSize: isMobile ? 12 : 12 }}
          labelStyle={{ fontSize: isMobile ? 12 : 14 }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? 12 : 12,
            marginTop: isMobile ? 5 : 0,
            paddingTop: isMobile ? 10 : 0
          }} 
        />
        <Bar dataKey="Hours Worked" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
