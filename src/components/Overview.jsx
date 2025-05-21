import { Activity, Users, Server, Clock } from 'lucide-react';

function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <Users className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <div className="text-2xl font-bold">128</div>
          <p className="text-xs text-gray-500">+14% from last month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Active Instances</h3>
          <Server className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-gray-500">+2 since yesterday</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Uptime</h3>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <div className="text-2xl font-bold">99.9%</div>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-500">Resource Usage</h3>
          <Activity className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <div className="text-2xl font-bold">78%</div>
          <p className="text-xs text-gray-500">+12% from last week</p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
