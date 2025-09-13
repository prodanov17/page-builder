// The interface now expects a JSON string
interface PrebuiltComponent {
  name: string;
  componentJson: string;
}

export const prebuiltComponents: PrebuiltComponent[] = [
  {
    name: "Navbar",
    componentJson: `
    {
        "id": "el-mfi7ky3p-cghc6",
        "type": "container",
        "props": {
            "width": "auto",
            "padding": "16px 32px",
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "space-between",
            "alignItems": "center",
            "backgroundColor": "#ffffff",
            "borderBottom": "1px solid #e2e8f0"
        },
        "children": [
            {
                "id": "el-mfi7ky3p-dfc9l",
                "type": "text",
                "props": {
                    "content": "ByteHaven",
                    "fontSize": "24px",
                    "fontWeight": "bold",
                    "color": "#1e293b"
                }
            },
            {
                "id": "el-mfi7ky3p-jxssq",
                "type": "container",
                "props": {
                    "display": "flex",
                    "flexDirection": "row",
                    "gap": "24px",
                    "alignItems": "center"
                },
                "children": [
                    {
                        "id": "el-mfi7ky3p-quk6x",
                        "type": "text",
                        "props": {
                            "content": "Home",
                            "color": "#475569"
                        }
                    },
                    {
                        "id": "el-mfi7ky3p-a0h6l",
                        "type": "text",
                        "props": {
                            "content": "Features",
                            "color": "#475569"
                        }
                    },
                    {
                        "id": "el-mfi7ky3p-26wg4",
                        "type": "text",
                        "props": {
                            "content": "Pricing",
                            "color": "#475569"
                        }
                    }
                ]
            },
            {
                "id": "el-mfi7ky3p-8jn4z",
                "type": "button",
                "props": {
                    "content": "Get Started",
                    "backgroundColor": "#2563eb",
                    "color": "#ffffff",
                    "padding": "10px 20px",
                    "borderRadius": "8px",
                    "text": "Get started"
                }
            }
        ],
        "name": "Navbar",
        "__type": "builder-component"
    }
    `,
  },

  {
    name: "Footer",
    componentJson: `
    {
        "id": "el-mfi7zf77-ubd3c",
        "type": "container",
        "props": {
            "width": "auto",
            "padding": "48px 32px",
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "space-between",
            "alignItems": "flex-start",
            "backgroundColor": "#2e2e2e",
            "gap": "32px"
        },
        "children": [
            {
                "id": "el-mfi7zf77-cpchy",
                "type": "container",
                "props": {
                    "display": "flex",
                    "flexDirection": "column",
                    "gap": "8px"
                },
                "children": [
                    {
                        "id": "el-mfi7zf77-jvdzi",
                        "type": "text",
                        "props": {
                            "content": "ByteHaven",
                            "fontSize": "24px",
                            "fontWeight": "bold",
                            "color": "#ffffff"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-kxm61",
                        "type": "text",
                        "props": {
                            "content": "© 2025 All rights reserved.",
                            "fontSize": "14px",
                            "color": "#94a3b8"
                        }
                    }
                ]
            },
            {
                "id": "el-mfi7zf77-ip7ze",
                "type": "container",
                "props": {
                    "display": "flex",
                    "flexDirection": "column",
                    "gap": "12px"
                },
                "children": [
                    {
                        "id": "el-mfi7zf77-qmdzn",
                        "type": "text",
                        "props": {
                            "content": "Product",
                            "fontWeight": "600",
                            "color": "#ffffff"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-4tgye",
                        "type": "text",
                        "props": {
                            "content": "Features",
                            "color": "#94a3b8"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-v4lqo",
                        "type": "text",
                        "props": {
                            "content": "Pricing",
                            "color": "#94a3b8"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-424vs",
                        "type": "text",
                        "props": {
                            "content": "Integrations",
                            "color": "#94a3b8"
                        }
                    }
                ]
            },
            {
                "id": "el-mfi7zf77-zcwlv",
                "type": "container",
                "props": {
                    "display": "flex",
                    "flexDirection": "column",
                    "gap": "12px"
                },
                "children": [
                    {
                        "id": "el-mfi7zf77-v63q2",
                        "type": "text",
                        "props": {
                            "content": "Company",
                            "fontWeight": "600",
                            "color": "#ffffff"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-glqkz",
                        "type": "text",
                        "props": {
                            "content": "About Us",
                            "color": "#94a3b8"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-izo5z",
                        "type": "text",
                        "props": {
                            "content": "Careers",
                            "color": "#94a3b8"
                        }
                    },
                    {
                        "id": "el-mfi7zf77-4h176",
                        "type": "text",
                        "props": {
                            "content": "Contact",
                            "color": "#94a3b8"
                        }
                    }
                ]
            }
        ],
        "name": "Footer",
        "__type": "builder-component"
    }
    `,
  },
  {
    name: "Hero Section",
    // Use a template literal (`) to easily paste multi-line JSON
    componentJson: `
    {
        "type": "container",
        "props": {
            "width": "auto",
            "padding": "60px 20px",
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "alignItems": "center",
            "gap": "16px",
            "backgroundImage": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&fm=jpg&crop=entropy&w=1200",
                "backgroundSize": "cover",
            "backgroundPosition": "center",
            "borderRadius": "12px",
            "height": "450px"
        },
        "children": [
            {
                "type": "text",
                "props": {
                    "content": "Welcome to Our Website",
                    "fontSize": "48px",
                    "fontWeight": "bold",
                    "color": "#ffffff",
                    "textAlign": "center"
                },
                "id": "el-mfi62tkl-gqcoq"
            },
            {
                "type": "text",
                "props": {
                    "content": "Discover amazing things here. Your journey starts now.",
                    "fontSize": "18px",
                    "color": "#ffffff",
                    "textAlign": "center",
                    "width": ""
                },
                "id": "el-mfi62tkl-e6sck",
                "name": "text"
            },
            {
                "type": "button",
                "props": {
                    "content": "Get Started",
                    "backgroundColor": "#2563eb",
                    "color": "#ffffff",
                    "padding": "12px 24px",
                    "borderRadius": "8px",
                    "border": "none",
                    "text": "Get Started"
                },
                "id": "el-mfi62tkl-r90tr"
            }
        ],
        "id": "el-mfi62tkl-ndxmv",
        "name": "Hero",
        "__type": "builder-component"
    }
    `,
  },
  {
    name: "Cards section",
    componentJson: `
    {
        "id": "el-mfi8yzes-zk7i2",
        "type": "container",
        "props": {
            "padding": "40px 20px 40px 20px",
            "display": "flex",
            "flexDirection": "column",
            "gap": "10px"
        },
        "children": [
            {
                "id": "el-mfi8zdnw-jmzqw",
                "type": "text",
                "props": {
                    "content": "What we offer?",
                    "fontSize": "32px",
                    "textAlign": "center",
                    "fontWeight": "500"
                }
            },
            {
                "id": "el-mfi91tk7-jtczr",
                "type": "container",
                "props": {
                    "padding": "20px",
                    "display": "flex",
                    "flexDirection": "row",
                    "gap": "10px",
                    "width": "",
                    "justifyContent": "center"
                },
                "children": [
                    {
                        "id": "el-mfi92awn-skemu",
                        "type": "container",
                        "props": {
                            "padding": "20px",
                            "display": "flex",
                            "flexDirection": "column",
                            "gap": "10px",
                            "backgroundColor": "#fcfcfc",
                            "width": "auto"
                        },
                        "children": [
                            {
                                "id": "el-mfi9390r-yipui",
                                "type": "image",
                                "props": {
                                    "width": "200px",
                                    "height": "150px",
                                    "alt": "Placeholder",
                                    "src": "https://plus.unsplash.com/premium_photo-1661456368974-7f6db9e0f91f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwd29ya2luZyUyMG9uJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D"
                                }
                            },
                            {
                                "id": "el-mfi93fdk-n6pzm",
                                "type": "text",
                                "props": {
                                    "content": "✨ Easy to Use",
                                    "fontSize": "16px",
                                    "fontWeight": "500"
                                }
                            },
                            {
                                "id": "el-mfi95336-5olxa",
                                "type": "text",
                                "props": {
                                    "content": "Get started in minutes with a clean, intuitive interface that helps you focus on what matters—without the clutter.",
                                    "fontSize": "13px",
                                    "color": "#878787",
                                    "width": "195px"
                                }
                            },
                            {
                                "id": "el-mfi93gvs-jw7i2",
                                "type": "button",
                                "props": {
                                    "text": "Learn more",
                                    "padding": "5px 12px 5px 12px",
                                    "backgroundColor": "#2563eb",
                                    "color": "#ffffff",
                                    "border": "none",
                                    "borderRadius": "4px",
                                    "width": "auto",
                                    "height": "auto"
                                }
                            }
                        ]
                    },
                    {
                        "id": "el-mfi9exo2-f7rwi",
                        "type": "container",
                        "props": {
                            "padding": "20px",
                            "display": "flex",
                            "flexDirection": "column",
                            "gap": "10px",
                            "backgroundColor": "#fcfcfc",
                            "width": "auto"
                        },
                        "children": [
                            {
                                "id": "el-mfi9exo2-uqxyc",
                                "type": "image",
                                "props": {
                                    "width": "200px",
                                    "height": "150px",
                                    "alt": "Placeholder",
                                    "src": "https://www.devoteam.com/wp-content/uploads/2024/12/mohammad-rahmani-oXlXu2qukGE-unsplash-scaled-e1674744349432.jpg"
                                }
                            },
                            {
                                "id": "el-mfi9exo2-2faex",
                                "type": "text",
                                "props": {
                                    "content": "⚡ Powerful Features",
                                    "fontSize": "16px",
                                    "fontWeight": "500"
                                }
                            },
                            {
                                "id": "el-mfi9exo2-pu8g1",
                                "type": "text",
                                "props": {
                                    "content": "From quick setup to advanced tools, everything scales with you. Customize your workflow to match your needs.",
                                    "fontSize": "13px",
                                    "color": "#878787",
                                    "width": "195px"
                                }
                            },
                            {
                                "id": "el-mfi9exo2-hjian",
                                "type": "button",
                                "props": {
                                    "text": "Learn more",
                                    "padding": "5px 12px 5px 12px",
                                    "backgroundColor": "#2563eb",
                                    "color": "#ffffff",
                                    "border": "none",
                                    "borderRadius": "4px",
                                    "width": "auto",
                                    "height": "auto"
                                }
                            }
                        ]
                    },
                    {
                        "id": "el-mfi9g3sy-7ygc5",
                        "type": "container",
                        "props": {
                            "padding": "20px",
                            "display": "flex",
                            "flexDirection": "column",
                            "gap": "10px",
                            "backgroundColor": "#fcfcfc",
                            "width": "auto"
                        },
                        "children": [
                            {
                                "id": "el-mfi9g3sy-5j2x2",
                                "type": "image",
                                "props": {
                                    "width": "200px",
                                    "height": "150px",
                                    "alt": "Placeholder",
                                    "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjQSwKpk5_JEersAr9owp9f-qjFU_1wbINA&s"
                                }
                            },
                            {
                                "id": "el-mfi9g3sy-oad0f",
                                "type": "text",
                                "props": {
                                    "content": "🔒 Secure & Trusted",
                                    "fontSize": "16px",
                                    "fontWeight": "500"
                                }
                            },
                            {
                                "id": "el-mfi9g3sy-q91e1",
                                "type": "text",
                                "props": {
                                    "content": "Your data is safe with us. We use modern infrastructure and best practices to keep everything running smoothly.",
                                    "fontSize": "13px",
                                    "color": "#878787",
                                    "width": "195px"
                                }
                            },
                            {
                                "id": "el-mfi9g3sy-2zf6t",
                                "type": "button",
                                "props": {
                                    "text": "Learn more",
                                    "padding": "5px 12px 5px 12px",
                                    "backgroundColor": "#2563eb",
                                    "color": "#ffffff",
                                    "border": "none",
                                    "borderRadius": "4px",
                                    "width": "auto",
                                    "height": "auto"
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "__type": "builder-component"
    }
    `,
  },
];
