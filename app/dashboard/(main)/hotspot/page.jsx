"use client";

import React, { useState } from "react";

// Mock data for quick overview statistics
const HOTSPOT_STATS = [
  { label: "Active Connections", value: "328", change: "+12% today", status: "success" },
  { label: "Vouchers Used Today", value: "1,420", change: "+8% vs yesterday", status: "neutral" },
  { label: "Active Zones / Access Points", value: "24", change: "100% Operational", status: "success" },
  { label: "Total Revenue (Today)", value: "৳14,250", change: "+15% vs yesterday", status: "success" },
];

const RECENT_VOUCHER_SESSIONS = [
  { id: "vch_9821", code: "HOT-8849-21", zone: "Uttara Sector 7 Park", plan: "2 Hours Unlimited", usedAt: "10:32 AM", status: "Active" },
  { id: "vch_9822", code: "HOT-3310-90", zone: "Dhanmondi Lake Cafe", plan: "1 GB Data Pack", usedAt: "10:28 AM", status: "Active" },
  { id: "vch_9823", code: "HOT-5542-11", zone: "Banani Club Zone", plan: "24 Hour Day Pass", usedAt: "10:15 AM", status: "Expired" },
  { id: "vch_9824", code: "HOT-1102-44", zone: "Uttara Sector 7 Park", plan: "1 Hour Fast Pass", usedAt: "10:02 AM", status: "Active" },
];

const HotspotDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Header with Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Hotspot & Voucher Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time monitoring for captive portal sessions, active Wi-Fi users, and voucher sales performance.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {["12h", "24h", "7d", "30d"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedTimeframe === timeframe
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {timeframe.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HOTSPOT_STATS.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Hotspot Zones Performance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Active Access Point Locations</h3>
              <p className="text-xs text-gray-500">Live bandwidth distribution across active captive portals</p>
            </div>
            <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View All APs →</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Uttara Sector 7 Park AP</span>
                <span className="text-gray-900 font-bold">142 Users (42 Mbps)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Dhanmondi Lake Zone</span>
                <span className="text-gray-900 font-bold">98 Users (28 Mbps)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "55%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Banani Commercial Hub</span>
                <span className="text-gray-900 font-bold">64 Users (18 Mbps)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Voucher Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-semibold text-gray-900">Voucher Stock Inventory</h3>
            <p className="text-xs text-gray-500">Current batch availability status</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-800">1 Hour Fast Pass (৳20)</p>
                <p className="text-[11px] text-gray-500">Unused: 450 codes</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">High Stock</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-800">24 Hour Day Pass (৳100)</p>
                <p className="text-[11px] text-gray-500">Unused: 32 codes</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Low Stock</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-800">5 GB Data Voucher (৳50)</p>
                <p className="text-[11px] text-gray-500">Unused: 820 codes</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">High Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Sessions Stream */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Recent Voucher Redeems</h3>
            <p className="text-xs text-gray-500">Live stream of users authenticating via captive portal</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Voucher Code</th>
                <th className="py-3 px-4">Hotspot Zone</th>
                <th className="py-3 px-4">Plan / Package</th>
                <th className="py-3 px-4">Redeemed At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RECENT_VOUCHER_SESSIONS.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-mono font-medium text-gray-900">{session.code}</td>
                  <td className="py-3 px-4">{session.zone}</td>
                  <td className="py-3 px-4">{session.plan}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{session.usedAt}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        session.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HotspotDashboard;