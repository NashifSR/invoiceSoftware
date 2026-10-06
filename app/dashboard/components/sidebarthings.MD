const sidebarSections = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: "Core ISP",
    items: [
      {
        label: "Configuration",
        icon: Settings,
        children: [
          { label: "Operational Zones", href: "/dashboard/config/zones" }, // Combined Zones & Sub-zones view or toggle
          { label: "Locations (Geo)", href: "/dashboard/config/locations" }, // Collapsed Districts/Upazilas/Unions into one page with tabs
          { label: "Packages", href: "/dashboard/config/packages" },
          { label: "Client Types & Protocols", href: "/dashboard/config/client-types" }, // Combined Client Types, Protocol & Connection Types
          { label: "Billing Status", href: "/dashboard/config/billing-status" },
          { label: "System Preferences", href: "/dashboard/config/preferences" }, // Replaces Client ID & Client Configure
        ],
      },
      {
        label: "Clients",
        icon: Users,
        children: [
          { label: "Client List", href: "/dashboard/clients" },
          { label: "Add Client", href: "/dashboard/clients/add" },
          { label: "Signup Requests", href: "/dashboard/clients/signup-requests" },
          { label: "Left Clients", href: "/dashboard/clients/left" },
        ],
      },
      {
        label: "Accounts",
        icon: Wallet,
        children: [
          { label: "Billing List", href: "/dashboard/billing" },
          { label: "Collection", href: "/dashboard/billing/collection" },
          { label: "Billing History", href: "/dashboard/billing/history" },
          { label: "Expenses", href: "/dashboard/accounting/expenses" },
          { label: "Profit & Loss", href: "/dashboard/accounting/profit-loss" },
          { label: "Ledger", href: "/dashboard/accounting/ledger" },
        ],
      },
      {
        label: "Hotspot",
        icon: Wifi,
        children: [
          { label: "Dashboard", href: "/dashboard/hotspot" },
          { label: "Hotspot Users", href: "/dashboard/hotspot/users" },
          { label: "User Profiles", href: "/dashboard/hotspot/profiles" },
          { label: "Hotspot Servers", href: "/dashboard/hotspot/servers" },
          { label: "Active Sessions", href: "/dashboard/hotspot/active-sessions" },
          { label: "Vouchers", href: "/dashboard/hotspot/vouchers" },
          { label: "Vouchers Template", href: "/dashboard/hotspot/voucher-templates" },
          { label: "Reports", href: "/dashboard/hotspot/reports" },
        ],
      },
    ],
  },

  {
    label: "Infrastructure & Network",
    items: [
      {
        label: "Server & Distribution",
        icon: Server,
        children: [
          { label: "Dashboard", href: "/dashboard/network/server-distribution" },
          { label: "Servers", href: "/dashboard/network/servers" },
          { label: "Import From Mikrotik", href: "/dashboard/network/import" },
          { label: "PPPoE Popup", href: "/dashboard/network/pppoe-popup" },
          { label: "OLT Management", href: "/dashboard/network/olt" },
        ],
      },
      {
        label: "Network",
        icon: Network,
        children: [
          { label: "Network Map", href: "/dashboard/network/map" },
          { label: "Fiber Diagram", href: "/dashboard/network/fiber" },
        ],
      },
      {
        label: "NMS",
        icon: Activity,
        children: [
          { label: "Dashboard", href: "/dashboard/network/nms" },
          { label: "Institutions", href: "/dashboard/network/nms/institutions" },
          { label: "Routers", href: "/dashboard/network/nms/routers" },
          { label: "Vendors", href: "/dashboard/network/nms/vendors" },
          { label: "Monitoring", href: "/dashboard/network/nms/monitoring" },
          { label: "Map View", href: "/dashboard/network/nms/map" },
          { label: "Diagnostics", href: "/dashboard/network/nms/diagnostics" },
          { label: "Locations", href: "/dashboard/network/nms/divisions" },
        ],
      },
      {
        label: "Bandwidth",
        icon: Gauge,
        children: [
          { label: "Dashboard", href: "/dashboard/network/bandwidth" },
          { label: "Providers", href: "/dashboard/network/bandwidth/providers" },
          { label: "Purchases", href: "/dashboard/network/bandwidth/purchases" },
          { label: "Sales", href: "/dashboard/network/bandwidth/sales" },
          { label: "Monitoring", href: "/dashboard/network/bandwidth/monitoring" },
        ],
      },
      {
        label: "MAC Reseller",
        icon: UserCheck,
        children: [
          { label: "Mac Reseller List", href: "/dashboard/mac-reseller/list" },
          { label: "Packages", href: "/dashboard/mac-reseller/packages" },
          { label: "MAC Reseller Funding", href: "/dashboard/mac-reseller/funding" },
        ],
      },
      {
        label: "Hardware & ONUs",
        icon: Cpu,
        children: [
          { label: "ONU Serial Mapping", href: "/dashboard/hardware/onus" },
          { label: "Assigned Routers", href: "/dashboard/hardware/routers" },
        ],
      },
    ],
  },

  {
    label: "Operations & Management",
    items: [
      {
        label: "IT Service Management",
        icon: LifeBuoy,
        children: [
          { label: "Support Dashboard", href: "/dashboard/itsm" },
          { label: "Tickets", href: "/dashboard/itsm/tickets" },
          { label: "Technician Performance", href: "/dashboard/itsm/technician-performance" },
          { label: "Knowledge Base", href: "/dashboard/itsm/knowledge" },
        ],
      },
      {
        label: "HR & Payroll",
        icon: Briefcase,
        children: [
          { label: "Departments", href: "/dashboard/hr-payroll/departments" },
          { label: "Employees", href: "/dashboard/hr-payroll/employees" },
          { label: "Attendance", href: "/dashboard/hr-payroll/attendance" },
          { label: "Payroll", href: "/dashboard/hr-payroll/payroll" },
          { label: "Biometric Device", href: "/dashboard/hr-payroll/biometric-devices" },
        ],
      },
      {
        label: "Purchase",
        icon: ShoppingCart,
        children: [
          { label: "Dashboard", href: "/dashboard/purchase" },
          { label: "Products", href: "/dashboard/purchase/products" },
          { label: "Vendors", href: "/dashboard/purchase/vendors" },
          { label: "Purchase Orders", href: "/dashboard/purchase/purchase-orders" },
          { label: "Inventory", href: "/dashboard/purchase/inventory" },
          { label: "Requisitions", href: "/dashboard/purchase/requisitions" },
        ],
      },
      {
        label: "CRM & Leads",
        icon: Target,
        children: [
          { label: "Sales Leads", href: "/dashboard/crm/leads" },
          { label: "Follow-ups", href: "/dashboard/crm/followups" },
        ],
      },
    ],
  },

  {
    label: "Communications",
    items: [
      {
        label: "SMS Service",
        icon: MessageSquare,
        children: [
          { label: "Dashboard", href: "/dashboard/communications/sms" },
          { label: "Send SMS", href: "/dashboard/communications/sms/send" },
          { label: "Messages", href: "/dashboard/communications/sms/messages" },
          { label: "Gateways", href: "/dashboard/communications/sms/gateways" },
          { label: "Devices", href: "/dashboard/communications/sms/devices" },
          { label: "Templates", href: "/dashboard/communications/sms/templates" },
          { label: "Reports", href: "/dashboard/communications/sms/reports" },
        ],
      },
      {
        label: "WhatsApp",
        icon: MessageCircle,
        children: [
          { label: "Dashboard", href: "/dashboard/communications/whatsapp" },
          { label: "Devices", href: "/dashboard/communications/whatsapp/devices" },
          { label: "Send Message", href: "/dashboard/communications/whatsapp/send" },
          { label: "Templates", href: "/dashboard/communications/whatsapp/templates" },
          { label: "Messages", href: "/dashboard/communications/whatsapp/messages" },
          { label: "Chatbot", href: "/dashboard/communications/whatsapp/chatbot" },
          { label: "Schedules", href: "/dashboard/communications/whatsapp/schedules" },
          { label: "Contacts", href: "/dashboard/communications/whatsapp/contacts" },
        ],
      },
    ],
  },

  {
    label: "System & Reports",
    items: [
      {
        label: "Reports",
        href: "/dashboard/reports",
        icon: FileBarChart,
      },
      {
        label: "UPAC",
        href: "/dashboard/upac",
        icon: ShieldCheck,
      },
      {
        label: "Settings",
        icon: Sliders,
        children: [
          { label: "Dashboard", href: "/dashboard/settings" },
          { label: "App Users", href: "/dashboard/settings/app-users" },
          { label: "Invoice Setup", href: "/dashboard/settings/invoice-setup" },
          { label: "Periods Setup", href: "/dashboard/settings/periods-setup" },
          { label: "Payment Gateways", href: "/dashboard/settings/payment-gateways" },
          { label: "Customer Portal Settings", href: "/dashboard/settings/customer-portal" },
          { label: "API & Webhooks", href: "/dashboard/settings/api-integrations" },
          { label: "Audit Logs", href: "/dashboard/settings/audit-logs" },
        ],
      },
      {
        label: "Release Notes",
        href: "/dashboard/release-notes",
        icon: Bell,
      },
    ],
  },
];