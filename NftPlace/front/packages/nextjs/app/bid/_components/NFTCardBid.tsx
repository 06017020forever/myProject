
import { OnBidCollectible } from "../page";

import { useRouter } from "next/navigation";
import { CountdownTimer } from "~~/app/transfers/_components/CountdownTimerCard";
export const NFTCardBid = ({ nft }: { nft: OnBidCollectible }) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/bidTractions/${nft.tokenId}`);
    };

    return (
        <div className="card bg-base-100 shadow-lg w-[280px] h-[470px] rounded-lg overflow-hidden group relative transform transition-transform duration-300 hover:scale-105"
            onClick={handleCardClick}
        >
            <figure className="relative overflow-hidden">
                <img src={nft.image} alt="NFT Image" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </figure>
            <div className="flex space-x-3 mt-1 items-center">
              <span className="text-sm font-semibold">
                竞拍倒计时: <CountdownTimer endDate={new Date(Number(nft.endTime) * 1000).toLocaleString()} />
              </span>
            </div>
        </div>
    );
};

export default NFTCardBid;
