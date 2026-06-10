import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompareProvider } from "@/lib/compare";
import { CompareBar } from "@/components/CompareBar";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    try {
      const { getPublicIntegrations } = await import("@/lib/public.functions");
      return { integrations: await getPublicIntegrations() };
    } catch {
      return {
        integrations: { ga4_id: "", gtm_id: "", google_site_verification: "", custom_head_js: "" },
      };
    }
  },
  head: (ctx) => {
    const integ = (ctx as { loaderData?: { integrations?: Record<string, string> } }).loaderData
      ?.integrations ?? {};
    const ga4 = integ.ga4_id ?? "";
    const gtm = integ.gtm_id ?? "";
    const verify = integ.google_site_verification ?? "";
    const customJs = integ.custom_head_js ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const integrationScripts: any[] = [];
    if (gtm) {
      integrationScripts.push({
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
      });
    }
    if (ga4) {
      integrationScripts.push({
        src: `https://www.googletagmanager.com/gtag/js?id=${ga4}`,
        async: true,
      });
      integrationScripts.push({
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`,
      });
    }
    if (customJs) {
      integrationScripts.push({ children: customJs });
    }

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Car Gallery Dubai | Luxury & Supercars For Sale in Dubai" },
        {
          name: "description",
          content:
            "Car Gallery Dubai — Dubai's premier destination for luxury cars and supercars. Buy, sell and discover Ferrari, Lamborghini, Rolls-Royce, Porsche and more.",
        },
        { name: "author", content: "Car Gallery Dubai" },
        { property: "og:title", content: "Car Gallery Dubai | Luxury & Supercars" },
        {
          property: "og:description",
          content: "Dubai's premier destination for luxury cars and supercars.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Car Gallery Dubai" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(verify ? [{ name: "google-site-verification", content: verify }] : []),
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
      scripts: [
        ...integrationScripts,
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            name: "Car Gallery Dubai",
            description: "Luxury cars and supercars for sale in Dubai.",
            areaServed: "Dubai, United Arab Emirates",
            url: "https://cargallerydubai.com",
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CompareProvider>
        <div className="flex min-h-screen flex-col bg-background bg-grain">
          <Header />
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <Footer />
          <CompareBar />
          <Toaster />
        </div>
      </CompareProvider>
    </QueryClientProvider>
  );
}
