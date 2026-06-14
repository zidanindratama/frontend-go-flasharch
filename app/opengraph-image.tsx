import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt =
  "Go FlashArch flash sale shopping with clear stock and checkout updates";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const shopperBenefits = [
  { label: "Stock checked", value: "Before you pay", color: "#39ff14" },
  { label: "Fast checkout", value: "For busy drops", color: "#ff6600" },
  { label: "Order updates", value: "Clear next steps", color: "#f7efe4" },
];

const productImageUrl =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=90";

function BrandMark() {
  return (
    <div
      style={{
        position: "relative",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        background: "rgba(255,102,0,0.1)",
      }}
    >
      <svg
        width="31"
        height="31"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
          stroke="#FF6600"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#15110f",
        color: "#f8f1e7",
        fontFamily:
          'Plus Jakarta Sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(120deg, rgba(255,102,0,0.22) 0%, rgba(21,17,15,0.2) 40%, rgba(220,20,60,0.24) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(rgba(248,241,231,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(248,241,231,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "linear-gradient(90deg, rgba(0,0,0,0.96), rgba(0,0,0,0.72) 58%, rgba(0,0,0,0.4))",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -96,
          top: -180,
          width: 570,
          height: 570,
          display: "flex",
          borderRadius: 999,
          background: "rgba(255,102,0,0.3)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: -230,
          width: 650,
          height: 650,
          display: "flex",
          borderRadius: 999,
          background: "rgba(57,255,20,0.12)",
          filter: "blur(10px)",
        }}
      />

      <div
        style={{
          width: "56%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 0 56px 70px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <BrandMark />
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ fontSize: 25, fontWeight: 800 }}>
              {siteConfig.name}
            </div>
            <div
              style={{
                color: "rgba(248,241,231,0.66)",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Flash sale shopping made easier to trust
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              width: 156,
              height: 35,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,102,0,0.38)",
              borderRadius: 999,
              background: "rgba(255,102,0,0.14)",
              color: "#ff9b45",
              fontSize: 14,
              fontWeight: 900,
            }}
          >
            LIMITED DROP
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: 0,
              maxWidth: 640,
            }}
          >
            <span>Know what is</span>
            <span>still in stock.</span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 575,
              color: "rgba(248,241,231,0.78)",
              fontSize: 24,
              lineHeight: 1.32,
              fontWeight: 500,
            }}
          >
            Shop limited products with clearer availability, quicker checkout
            feedback, and order status you can follow after the rush.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {shopperBenefits.map((item) => (
            <div
              key={item.label}
              style={{
                width: 178,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "15px 16px",
                border: "1px solid rgba(248,241,231,0.2)",
                borderRadius: 18,
                background: "rgba(21,17,15,0.74)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: item.color,
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: item.color,
                  }}
                />
                {item.label}
              </div>
              <div style={{ color: "#f8f1e7", fontSize: 16, fontWeight: 700 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingRight: 58,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 68,
            width: 330,
            height: 420,
            display: "flex",
            borderRadius: 44,
            border: "1px solid rgba(248,241,231,0.16)",
            background: "rgba(248,241,231,0.06)",
            transform: "rotate(6deg)",
          }}
        />

        <div
          style={{
            width: 410,
            height: 492,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 34,
            background: "#f8f1e7",
            color: "#201a16",
            padding: 28,
            boxShadow: "0 38px 92px rgba(0,0,0,0.36)",
            transform: "rotate(-2deg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ color: "#7b7067", fontSize: 14, fontWeight: 900 }}>
                TODAY'S DROP
              </div>
              <div style={{ fontSize: 30, fontWeight: 900 }}>12:00 WIB</div>
            </div>
            <div
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                borderRadius: 999,
                background: "#dc143c",
                color: "#f8f1e7",
                padding: "0 17px",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              73% OFF
            </div>
          </div>

          <div
            style={{
              height: 205,
              display: "flex",
              position: "relative",
              overflow: "hidden",
              borderRadius: 29,
              background: "#d95a16",
            }}
          >
            <img
              src={productImageUrl}
              alt="Limited drop sneakers"
              width="354"
              height="205"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                background:
                  "linear-gradient(180deg, rgba(21,17,15,0.02) 0%, rgba(21,17,15,0.18) 58%, rgba(21,17,15,0.48) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 24,
                bottom: 24,
                width: 126,
                height: 34,
                display: "flex",
                borderRadius: 999,
                background: "rgba(21,17,15,0.84)",
                color: "#f8f1e7",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              Best deal
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontSize: 27, fontWeight: 900 }}>
                  Ready to checkout
                </div>
                <div
                  style={{ color: "#7b7067", fontSize: 16, fontWeight: 700 }}
                >
                  Only 18 left at this price
                </div>
              </div>
              <div
                style={{
                  width: 68,
                  height: 68,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 21,
                  background: "#171210",
                  color: "#39ff14",
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                18
              </div>
            </div>
            <div
              style={{
                height: 16,
                display: "flex",
                overflow: "hidden",
                borderRadius: 99,
                background: "#ded1c4",
              }}
            >
              <div
                style={{
                  width: "78%",
                  display: "flex",
                  background: "#ff6600",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#7b7067",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              <span>Stock confirmed</span>
              <span>Order updates on</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
