import React, { useState } from "react";
import { RequestData } from "./ApiTester";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RequestBuilderProps {
  request: RequestData;
  onChange: (request: Partial<RequestData>) => void;
  onSend: (request: RequestData) => void;
  isLoading: boolean;
}

const RequestBuilder: React.FC<RequestBuilderProps> = ({
  request,
  onChange,
  onSend,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<string>("params");

  const handleAddHeader = () => {
    onChange({
      headers: [...request.headers, { key: "", value: "" }],
    });
  };

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeaders = [...request.headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onChange({ headers: newHeaders });
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...request.headers];
    newHeaders.splice(index, 1);
    onChange({ headers: newHeaders });
  };

  const handleAddParam = () => {
    onChange({
      params: [...request.params, { key: "", value: "" }],
    });
  };

  const handleParamChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newParams = [...request.params];
    newParams[index] = { ...newParams[index], [field]: value };
    onChange({ params: newParams });
  };

  const handleRemoveParam = (index: number) => {
    const newParams = [...request.params];
    newParams.splice(index, 1);
    onChange({ params: newParams });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-32">
            <Select
              value={request.method}
              onValueChange={(value) => onChange({ method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Input
              placeholder="Enter request URL"
              value={request.url}
              onChange={(e) => onChange({ url: e.target.value })}
            />
          </div>

          <Button
            onClick={() => onSend(request)}
            disabled={isLoading || !request.url}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="use-auth"
            checked={request.useAuth}
            onCheckedChange={(checked) => onChange({ useAuth: checked })}
          />
          <Label htmlFor="use-auth">Use Authentication Token</Label>
        </div>

        <Input
          placeholder="Request Name"
          value={request.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="font-medium"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="params">Query Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="space-y-4 pt-4">
          {request.params.map((param, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="Parameter Name"
                value={param.key}
                onChange={(e) =>
                  handleParamChange(index, "key", e.target.value)
                }
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={param.value}
                onChange={(e) =>
                  handleParamChange(index, "value", e.target.value)
                }
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveParam(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddParam}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Parameter
          </Button>
        </TabsContent>

        <TabsContent value="headers" className="space-y-4 pt-4">
          {request.headers.map((header, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="Header Name"
                value={header.key}
                onChange={(e) =>
                  handleHeaderChange(index, "key", e.target.value)
                }
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={header.value}
                onChange={(e) =>
                  handleHeaderChange(index, "value", e.target.value)
                }
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveHeader(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddHeader}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Header
          </Button>
        </TabsContent>

        <TabsContent value="body" className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="body">Request Body</Label>
              <Textarea
                id="body"
                placeholder="Enter request body (JSON)"
                value={request.body}
                onChange={(e) => onChange({ body: e.target.value })}
                className="font-mono h-64 mt-2"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestBuilder;
