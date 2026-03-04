import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authApi } from '@/lib/api';

export const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const runTests = async () => {
    setIsLoading(true);
    const results: any = {};

    try {
      // Test 1: Backend Health Check
      results.health = { status: 'testing' };
      const healthResponse = await fetch('http://localhost:5000/api/health');
      const healthData = await healthResponse.json();
      results.health = { status: 'success', data: healthData };
    } catch (error: any) {
      results.health = { status: 'error', message: error.message };
    }

    try {
      // Test 2: Fetch All Users
      results.users = { status: 'testing' };
      const usersData = await authApi.getAllUsers();
      results.users = { status: 'success', data: usersData };
      setAllUsers(usersData.users || []);
    } catch (error: any) {
      results.users = { status: 'error', message: error.message };
    }

    try {
      // Test 3: Test Login with Demo User
      results.login = { status: 'testing' };
      const loginData = await authApi.login('johndoe', 'password123');
      results.login = { status: 'success', data: loginData };
    } catch (error: any) {
      results.login = { status: 'error', message: error.message };
    }

    try {
      // Test 4: Check Current User from localStorage
      results.currentUser = { status: 'testing' };
      const user = authApi.getCurrentUser();
      if (user) {
        results.currentUser = { status: 'success', data: user };
      } else {
        results.currentUser = { status: 'info', message: 'No user in localStorage' };
      }
    } catch (error: any) {
      results.currentUser = { status: 'error', message: error.message };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'testing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>
            Test the MongoDB backend connection and API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTests} disabled={isLoading} className="w-full">
            {isLoading ? 'Running Tests...' : 'Run All Tests'}
          </Button>

          {/* Health Check Test */}
          {testResults.health && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Backend Health Check</CardTitle>
                  <Badge className={getStatusColor(testResults.health.status)}>
                    {testResults.health.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.health.status === 'success' && (
                  <p className="text-sm text-green-600">
                    ✓ Backend is running: {testResults.health.data.message}
                  </p>
                )}
                {testResults.health.status === 'error' && (
                  <p className="text-sm text-red-600">
                    ✗ Error: {testResults.health.message}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Users Fetch Test */}
          {testResults.users && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Fetch Users from Database</CardTitle>
                  <Badge className={getStatusColor(testResults.users.status)}>
                    {testResults.users.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.users.status === 'success' && (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">
                      ✓ Found {testResults.users.data.count} users in database
                    </p>
                    {allUsers.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold mb-1">Users:</p>
                        {allUsers.map((user: any) => (
                          <div key={user._id}>
                            {user.username} ({user.email})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {testResults.users.status === 'error' && (
                  <p className="text-sm text-red-600">
                    ✗ Error: {testResults.users.message}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Login Test */}
          {testResults.login && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Login Test (johndoe/password123)</CardTitle>
                  <Badge className={getStatusColor(testResults.login.status)}>
                    {testResults.login.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.login.status === 'success' && (
                  <p className="text-sm text-green-600">
                    ✓ Login successful for user: {testResults.login.data.user.username}
                  </p>
                )}
                {testResults.login.status === 'error' && (
                  <p className="text-sm text-red-600">
                    ✗ Error: {testResults.login.message}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Current User Test */}
          {testResults.currentUser && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Current User (localStorage)</CardTitle>
                  <Badge className={getStatusColor(testResults.currentUser.status)}>
                    {testResults.currentUser.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.currentUser.status === 'success' && (
                  <div className="text-sm text-green-600">
                    ✓ Current user: {testResults.currentUser.data.username}
                  </div>
                )}
                {testResults.currentUser.status === 'info' && (
                  <p className="text-sm text-blue-600">
                    ℹ {testResults.currentUser.message}
                  </p>
                )}
                {testResults.currentUser.status === 'error' && (
                  <p className="text-sm text-red-600">
                    ✗ Error: {testResults.currentUser.message}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">1. Backend Setup:</p>
                <code className="text-blue-700 dark:text-blue-300">
                  cd backend && npm install
                </code>
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">2. Seed Database:</p>
                <code className="text-blue-700 dark:text-blue-300">npm run seed</code>
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">3. Start Backend:</p>
                <code className="text-blue-700 dark:text-blue-300">npm start</code>
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">4. Backend URL:</p>
                <code className="text-blue-700 dark:text-blue-300">
                  http://localhost:5000
                </code>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
