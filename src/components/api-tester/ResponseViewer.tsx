import React, { useState } from "react";
import { ResponseData } from "./ApiTester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, FileJson, FileText, HardDrive } from "lucide-react";

interface ResponseViewerProps {
  response: ResponseData | null;
  isLoading: boolean;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<string>("body");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <FileJson className="h-12 w-12 mb-4" />
        <p>Send a request to see the response</p>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-green-100 text-green-800 border-green-200";
    if (status >= 300 && status < 400)
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (status >= 400 && status < 500)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status >= 500) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className={`text-sm font-medium ${getStatusColor(response.status)}`}
          >
            {response.status} {response.statusText}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {response.time}ms
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <HardDrive className="mr-1 h-4 w-4" />
            {formatBytes(response.size)}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="pt-4">
          <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 font-mono text-sm">
              {formatJson(response.data)}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="headers" className="pt-4">
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-sm">{key}</div>
                  <div className="col-span-2 text-sm break-all">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseViewer;
