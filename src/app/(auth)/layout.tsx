export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        
          <section className={` flex items-center justify-center h-screen w-screen bg-slate-200 antialiased`}>
            {children}
          </section>
        
    );
  }
  