import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import RequestBuilder from "./RequestBuilder";
import ResponseViewer from "./ResponseViewer";
import RequestHistory from "./RequestHistory";
import SavedRequests from "./SavedRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export interface RequestData {
  id?: string;
  name: string;
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  params: { key: string; value: string }[];
  body: string;
  useAuth: boolean;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

export interface SavedRequest extends RequestData {
  id: string;
  createdAt: string;
  collectionId?: string;
}

export interface RequestHistoryItem extends RequestData {
  id: string;
  timestamp: string;
  response?: ResponseData;
}

const ApiTester = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("builder");
  const [currentRequest, setCurrentRequest] = useState<RequestData>({
    name: "New Request",
    method: "GET",
    url: "",
    headers: [],
    params: [],
    body: "",
    useAuth: true,
  });
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);

  // Load saved requests and history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("api_tester_history");
    const savedRequestsData = localStorage.getItem("api_tester_saved_requests");

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }

    if (savedRequestsData) {
      try {
        setSavedRequests(JSON.parse(savedRequestsData));
      } catch (e) {
        console.error("Failed to parse saved requests from localStorage", e);
      }
    }
  }, []);

  // Save history and saved requests to localStorage when they change
  useEffect(() => {
    localStorage.setItem("api_tester_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      "api_tester_saved_requests",
      JSON.stringify(savedRequests),
    );
  }, [savedRequests]);

  const handleRequestChange = (request: Partial<RequestData>) => {
    setCurrentRequest((prev) => ({ ...prev, ...request }));
  };

  const handleSaveRequest = () => {
    const newSavedRequest: SavedRequest = {
      ...currentRequest,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSavedRequests((prev) => [newSavedRequest, ...prev]);
  };

  const handleLoadRequest = (request: RequestData) => {
    setCurrentRequest(request);
    setActiveTab("builder");
  };

  const handleDeleteSavedRequest = (id: string) => {
    setSavedRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="w-full h-full bg-background">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">API Testing Module</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveRequest}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save Request
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r p-4 overflow-y-auto hidden md:block">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <RequestHistory
                  history={history}
                  onSelect={handleLoadRequest}
                  onClear={handleClearHistory}
                />
              </TabsContent>
              <TabsContent value="saved" className="mt-4">
                <SavedRequests
                  requests={savedRequests}
                  onSelect={handleLoadRequest}
                  onDelete={handleDeleteSavedRequest}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="px-4 pt-4">
                <TabsList>
                  <TabsTrigger value="builder">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="collections" className="md:hidden">
                    Collections
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="builder"
                className="flex-1 p-4 overflow-y-auto"
              >
                <Card>
                  <CardContent className="p-6">
                    <RequestBuilder
                      request={currentRequest}
                      onChange={handleRequestChange}
                      onSend={async (request) => {
                        setIsLoading(true);
                        try {
                          const startTime = performance.now();

                          // Build request URL with query parameters
                          let url = request.url;
                          if (request.params && request.params.length > 0) {
                            const queryParams = request.params
                              .filter((p) => p.key && p.value)
                              .map(
                                (p) =>
                                  `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`,
                              )
                              .join("&");

                            if (queryParams) {
                              url +=
                                (url.includes("?") ? "&" : "?") + queryParams;
                            }
                          }

                          // Build headers
                          const headers: Record<string, string> = {};
                          request.headers.forEach((h) => {
                            if (h.key && h.value) {
                              headers[h.key] = h.value;
                            }
                          });

                          // Add auth header if needed
                          if (request.useAuth && token) {
                            headers["Authorization"] = `Bearer ${token}`;
                          }

                          // Parse body based on content type
                          let body = request.body;
                          const contentType =
                            headers["Content-Type"] || headers["content-type"];
                          if (contentType === "application/json" && body) {
                            try {
                              body = JSON.parse(body);
                            } catch (e) {
                              console.error("Invalid JSON body", e);
                            }
                          }

                          // Make the request
                          const response = await fetch(url, {
                            method: request.method,
                            headers,
                            body: ["GET", "HEAD"].includes(request.method)
                              ? undefined
                              : body,
                            credentials: "include",
                          });

                          const endTime = performance.now();
                          const responseTime = endTime - startTime;

                          // Get response headers
                          const responseHeaders: Record<string, string> = {};
                          response.headers.forEach((value, key) => {
                            responseHeaders[key] = value;
                          });

                          // Get response data
                          let responseData;
                          let responseSize = 0;

                          const responseText = await response.text();
                          responseSize = new Blob([responseText]).size;

                          try {
                            responseData = JSON.parse(responseText);
                          } catch (e) {
                            responseData = responseText;
                          }

                          const responseObj: ResponseData = {
                            status: response.status,
                            statusText: response.statusText,
                            headers: responseHeaders,
                            data: responseData,
                            time: Math.round(responseTime),
                            size: responseSize,
                          };

                          setResponse(responseObj);
                          setActiveTab("response");

                          // Add to history
                          const historyItem: RequestHistoryItem = {
                            ...request,
                            id: `hist_${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            response: responseObj,
                          };

                          setHistory((prev) => [
                            historyItem,
                            ...prev.slice(0, 49),
                          ]);
                        } catch (error) {
                          console.error("Request failed", error);
                          setResponse({
                            status: 0,
                            statusText: "Error",
                            headers: {},
                            data: {
                              error:
                                error instanceof Error
                                  ? error.message
                                  : "Request failed",
                            },
                            time: 0,
                            size: 0,
                          });
                          setActiveTab("response");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="response"
                className="flex-1 p-4 overflow-y-auto"
              >
                <Card>
                  <CardContent className="p-6">
                    <ResponseViewer response={response} isLoading={isLoading} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="collections"
                className="flex-1 p-4 overflow-y-auto md:hidden"
              >
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="history">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="saved">Saved</TabsTrigger>
                      </TabsList>
                      <TabsContent value="history" className="mt-4">
                        <RequestHistory
                          history={history}
                          onSelect={handleLoadRequest}
                          onClear={handleClearHistory}
                        />
                      </TabsContent>
                      <TabsContent value="saved" className="mt-4">
                        <SavedRequests
                          requests={savedRequests}
                          onSelect={handleLoadRequest}
                          onDelete={handleDeleteSavedRequest}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
