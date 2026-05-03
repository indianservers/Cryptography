import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold">Route not found</h1><p className="mt-2 text-slate-600">That cryptography module is not in the router.</p><Link className="btn mt-5 inline-flex" to="/">Return home</Link></div>;
}

