import type { LocalUserRecord } from "@/types/auth";

import { hashMockPassword } from "./credentials";

type DemoUserDefinition = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: LocalUserRecord["role"];
};

const DEMO_USER_DEFINITIONS: DemoUserDefinition[] = [
  {
    id: "demo-customer",
    name: "Demo Customer",
    email: "customer@shopsphere.dev",
    password: "Customer123!",
    role: "customer",
  },
  {
    id: "demo-admin",
    name: "Demo Administrator",
    email: "admin@shopsphere.dev",
    password: "Admin123!",
    role: "admin",
  },
];

export const DEMO_LOGIN_HINTS = DEMO_USER_DEFINITIONS.map(
  ({ email, password, role }) => ({
    email,
    password,
    role,
  }),
);

export async function createDemoUsers(): Promise<LocalUserRecord[]> {
  return Promise.all(
    DEMO_USER_DEFINITIONS.map(async (user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: new Date(0).toISOString(),
      passwordHash: await hashMockPassword(user.password),
    })),
  );
}
