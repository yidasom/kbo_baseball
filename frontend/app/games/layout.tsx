import Nav from "../components/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full flex-col md:flex-row">
        <div className="w-full flex-none md:w-64">
          <Nav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </>
  );
}
