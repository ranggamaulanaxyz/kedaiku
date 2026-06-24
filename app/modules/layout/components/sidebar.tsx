import {
  AppWindow,
  Bell,
  ChevronRight,
  Cog,
  CreditCard,
  Dot,
  EllipsisVertical,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserCircle,
  LayoutDashboard,
  BadgeDollarSign,
  Package,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui/sidebar";

interface MenuItem {
  type: string;
  name: string;
  to?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: {
    type: string;
    name: string;
    to: string;
  }[];
}

const data: MenuItem[] = [
  {
    type: "menu",
    name: "Dashboard",
    to: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "menu",
    name: "Sales",
    to: "/app/sale",
    icon: BadgeDollarSign,
  },
  {
    type: "menu",
    name: "Inventory",
    icon: Package,
    children: [
      { type: "menu", name: "Products", to: "/app/products" },
      { type: "menu", name: "Stock", to: "/app/stock" },
    ],
  },
];

function LayoutSidebarMenuItemCollapsible({ item }: { item: MenuItem }) {
  const Icon = item.icon;
  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.name}>
            {Icon && <Icon className="size-4" />}
            <span>{item.name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.name}>
                <SidebarMenuSubButton asChild>
                  <NavLink to={child.to}>
                    <span>{child.name}</span>
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function LayoutSidebarMenuItem({ item }: { item: MenuItem }) {
  const Icon = item.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.name} asChild>
        <NavLink to={item.to || "#"}>
          {Icon && <Icon className="size-4" />}
          <span>{item.name}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function LayoutSidebarMenuUser() {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage
                src="https://ui.shadcn.com/avatars/shadcn.jpg"
                alt="Rangga"
              />
              <AvatarFallback className="rounded-lg">RM</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Rangga</span>
              <span className="text-muted-foreground truncate text-xs">
                ranggamxyz@example.com
              </span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src="https://ui.shadcn.com/avatars/shadcn.jpg"
                  alt="Rangga"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Rangga Maulana</span>
                <span className="text-muted-foreground truncate text-xs">
                  ranggamxyz@gmail.com
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserCircle />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/signout">
              <LogOut />
              <span>Sign Out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function LayoutSidebarMenuRender() {
  return (
    <>
      {data.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <LayoutSidebarMenuItemCollapsible key={item.name} item={item} />
          );
        }
        return <LayoutSidebarMenuItem key={item.name} item={item} />;
      })}
    </>
  );
}

export default function LayoutSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <ShoppingBag className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">KEDAIKU</span>
            <span className="truncate text-xs">V1.0.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Apps</SidebarGroupLabel>
            <SidebarMenu>
              <LayoutSidebarMenuRender />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/settings">
                    <Cog />
                    <span>Pengaturan</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="#">
                    <Search />
                    <span>Search</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <LayoutSidebarMenuUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
