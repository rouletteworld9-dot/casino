import { ExternalLink } from "lucide-react";

  const InfoRow = ({ label, value, isLink = false }) => (
    <div className="flex space-x-10 items-center border-b border-midnightPurple py-2">
      <p className="text-xs text-gray-400 min-w-[120px]">{label}:</p>
      {isLink ? (
        <a
          href={value}
          rel="noopener noreferrer"
          className="text-sm font-medium text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
        >
          View QR Code <ExternalLink size={12} />
        </a>
      ) : (
        <p className="text-sm font-medium text-gray-200">{value}</p>
      )}
    </div>
  );
export default InfoRow