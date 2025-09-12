import type { Component } from "@/types/builder";

// Define a type for a pre-built component entry
interface PrebuiltComponent {
  name: string;
  component: Omit<Component, "id">; // Omit 'id' as it will be generated on the fly
}

export const prebuiltComponents: PrebuiltComponent[] = [
  {
    name: "Hero Section",
    component: {
      type: "container",
      props: {
        width: "100%",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&fm=jpg&crop=entropy&w=1200)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "12px",
      },
      children: [
        {
          type: "text",
          props: {
            content: "Welcome to Our Website",
            fontSize: "48px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          type: "text",
          props: {
            content: "Discover amazing things here. Your journey starts now.",
            fontSize: "18px",
            color: "#f0f0f0",
            textAlign: "center",
            width: "60%",
          },
        },
        {
          type: "button",
          props: {
            content: "Get Started",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
          },
        },
      ],
    },
  },
  {
    name: "CTA Button",
    component: {
      type: "button",
      props: {
        content: "Learn More",
        backgroundColor: "#f97316",
        color: "white",
        padding: "10px 20px",
        borderRadius: "9999px",
        border: "none",
        fontWeight: "600",
        boxShadow: "0 4px 14px 0 rgb(0 0 0 / 10%)",
      },
    },
  },
];
