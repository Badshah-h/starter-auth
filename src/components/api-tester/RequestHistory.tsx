import React from "react";
import { RequestHistoryItem } from "./ApiTester";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  onSelect: (request: RequestHistoryItem) => void;
  onClear: () => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No request history yet</p>
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Recent Requests</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 border rounded-md hover:bg-accent cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex justify-between items-start">
                <div className="truncate flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{item.method}</Badge>
                    <span className="font-medium truncate">{item.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {item.url}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </div>
                {item.response && (
                  <Badge
                    variant="outline"
                    className={getStatusColor(item.response.status)}
                  >
                    {item.response.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RequestHistory;
