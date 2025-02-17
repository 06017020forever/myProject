

"use client";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useState, useEffect, useRef } from "react";
import { formatEther } from "viem";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTImage } from "../../transfers/_components/NFTImage";
import { notification } from "~~/utils/scaffold-eth";
import FragNFTCard from "../_components/FragNFTCard";
export interface TokenFragment extends Partial<NFTMetaData> {
  tokenId:string;
  fragId: string;
  fragprice: string;
  fragbuyer: string;
  fragseller: string;
  fragcreator: string;
  isListedFragSale: boolean;
  fragImageUri: string;
}


const NFTDetails = (props: { params: { id: string } }) => {
  const shardCountInputRef = useRef<HTMLInputElement>(null); // Correct type for input element
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const [reconstructedImageSrc, setReconstructedImageSrc] = useState<string | null>(null);
  const [isSlicedView, setIsSlicedView] = useState<boolean>(false);
  const [shardCount, setShardCount] = useState<number>();
  const [FragmentCollectibles, setFragmentCollectibles] = useState<TokenFragment[]>([]);
  const [Price, setPrice] = useState(""); // Rent price state
  const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
 const { address: connectedAddress } = useAccount();

  const rows = shardCount ? Math.ceil(Math.sqrt(shardCount)) : 0;
  const cols = shardCount ? Math.ceil(shardCount / rows) : 0;

  const padding = 5;

  // Pinata configuration
  const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

  const { data: AloneNFTDetail } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getNftItem",
    args: [BigInt(props.params.id)],
  });



  const { data: NftFragmentDetail } = useScaffoldReadContract({
    contractName: "FragmentManager",
    functionName: "nftFragment",
    args: [BigInt(props.params.id)],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const fetchedMetadata = await getMetadataFromIPFS(AloneNFTDetail?.tokenUri as string);
        setMetadata(fetchedMetadata);
      } catch (error) {
        console.error(`Error fetching metadata for tokenId ${AloneNFTDetail?.tokenId}:`, error);
      }
    };

    fetchMetadata();

  }, [AloneNFTDetail?.tokenUri]);



  // Fetch fragment URLs from the contract after storing
  const { data: tokenFragmentsUrl } = useScaffoldReadContract({
    contractName: "FragmentManager",
    functionName: "getAllFragmentsForToken",
    args: [BigInt(props.params.id)],
  });


  const fetchListedNfts = async (): Promise<void> => {

    try {
      const fetchedNfts: TokenFragment[] = await Promise.all(
        (tokenFragmentsUrl || []).map(async (item: any) => {
          const tokenId: string = item.tokenId.toString();
          const fragId: string = item.fragId.toString();
          const fragprice: string = formatEther(item.fragprice);
          const fragbuyer: string = item.fragbuyer;
          const fragseller: string = item.fragseller;
          const fragcreator: string = item.fragcreator;
          const isListedFragSale: boolean = item.isListedFragSale;
          const fragImageUri: string = item.fragImageUri;

          return {
            tokenId,
            fragId,
            fragprice,
            fragbuyer,
            fragseller,
            fragcreator,
            isListedFragSale,
            fragImageUri,

          };
        })
      );
      setFragmentCollectibles(fetchedNfts);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      notification.error("Error fetching NFTs");
    }
  };



  useEffect(() => {
    if (tokenFragmentsUrl && Array.isArray(tokenFragmentsUrl)) {
      const fragImageUris = tokenFragmentsUrl.map((fragment: any) => fragment.fragImageUri);
      console.log(fragImageUris);
      // setImageUriSlices(fragImageUris);
      setShardCount(fragImageUris.length)
      fetchListedNfts();
      reconstructImage(fragImageUris, fragImageUris.length); // Reconstruct image from contract fragments
    }
  }, [tokenFragmentsUrl]);


  useEffect(() => {

    if (metadata.image) {

      const imgElement = new Image();
      imgElement.crossOrigin = "Anonymous";
      imgElement.src = metadata.image;
      imgElement.onload = () => setImg(imgElement);

    }
  }, [metadata.image]);

  const sliceImage = async (imgElement: HTMLImageElement, fragCount: number): Promise<string[]> => {
    const rows = Math.ceil(Math.sqrt(fragCount));
    const cols = Math.ceil(fragCount / rows);

    const imgWidth = imgElement.width;
    const imgHeight = imgElement.height;
    const sliceWidth = imgWidth / cols - padding;
    const sliceHeight = imgHeight / rows - padding;

    const sliceArray: string[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sx = col * (imgWidth / cols);
        const sy = row * (imgHeight / rows);
        const sWidth = imgWidth / cols;
        const sHeight = imgHeight / rows;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = sliceWidth + padding;
          canvas.height = sliceHeight + padding;

          ctx.drawImage(
            imgElement,
            sx,
            sy,
            sWidth,
            sHeight,
            padding / 2,
            padding / 2,
            sliceWidth,
            sliceHeight
          );

          const dataUrl = canvas.toDataURL();
          sliceArray.push(dataUrl);
        }
      }
    }

    // Upload slices and return the URLs
    const uploadedUrls = await uploadSlicesToPinata(sliceArray);
    return uploadedUrls; // Return the uploaded URLs
  };

  // Upload the slices to Pinata and return the URLs
  const uploadSlicesToPinata = async (slices: string[]): Promise<string[]> => {

    const uploadedUrls: string[] = [];

    for (const slice of slices) {
      const formData = new FormData();
      const blob = await fetch(slice).then(res => res.blob()); // Convert base64 to Blob
      formData.append("file", blob, "slice.png");

      try {
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pinataJWT}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (data.IpfsHash) {
          const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
          uploadedUrls.push(imageUrl); // Store the URL of the uploaded slice
        } else {
          console.error("Error uploading slice:", slice);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    return uploadedUrls;
  };


  const reconstructImage = (sliceArray: string[], fragCount: number) => {
    // Calculate rows and columns based on the number of fragments
    const rows = Math.ceil(Math.sqrt(fragCount));
    const cols = Math.ceil(fragCount / rows);

    // Create a canvas to reconstruct the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions based on the number of fragments
    const imgWidth = 500; // You can set a default width, or dynamically fetch it if known
    const imgHeight = 500; // You can set a default height, or dynamically fetch it if known
    const sliceWidth = imgWidth / cols;
    const sliceHeight = imgHeight / rows;

    // Set canvas size to the original image dimensions
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    // Track the number of loaded images
    let loadedImages = 0;

    // Iterate over each slice in the sliceArray
    sliceArray.forEach((slice, index) => {
      const row = Math.floor(index / cols); // Determine the row for the current slice
      const col = index % cols; // Determine the column for the current slice

      const x = col * sliceWidth;
      const y = row * sliceHeight;

      const img = new Image();
      img.src = slice; // Set image source to the base64 or IPFS URL

      // Set cross-origin attribute to allow canvas export
      img.crossOrigin = "Anonymous";

      // Once the image is loaded, draw it on the canvas
      img.onload = () => {
        ctx.drawImage(img, x, y, sliceWidth, sliceHeight);

        // Check if all images have been loaded to finalize the reconstruction
        loadedImages += 1;
        if (loadedImages === sliceArray.length) {
          try {
            const dataURL = canvas.toDataURL(); // Convert canvas to Data URL (base64)
            setReconstructedImageSrc(dataURL); // Set the final reconstructed image source
            console.log(dataURL); // Optionally log the data URL for debugging
          } catch (error) {
            console.error("Error converting canvas to dataURL:", error);
          }
        }
      };

      // Handle image loading errors
      img.onerror = () => {
        console.error("Failed to load image:", slice);
      };
    });
  };


  const handleActionButtonClick = async () => {
    // const tokenId = tokenIdInputRef.current?.value; // Use optional chaining to avoid undefined errors
    const shardCount = shardCountInputRef.current?.value; // Use optional chaining
    console.log("片数", shardCount)


    if (!img) {
      notification.error("Image not loaded.");
      return;
    }
    const fragmentUrls = await sliceImage(img, Number(shardCount));// Use the sliced URLs to store in contract


    try {
        await writeContractAsync({
          functionName: "createFragmentizationNFT",
          args: [BigInt(props.params.id), BigInt(Number(shardCount)), fragmentUrls,parseEther(Price)],
      });

      notification.success("NFT fragments created successfully!");

    } catch (error) {
      notification.error("Failed to create NFT fragments.");
    }
  };

  console.log(connectedAddress)

  const toggleView = () => setIsSlicedView(!isSlicedView);

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <NFTImage image={metadata.image || ""} name={metadata.name || ""} />
        </div>
        <div>
          {/* <div>
          <div className="flex gap-4 mt-6">
            <div className="mb-4">
              <label htmlFor="rentPrice" className="block mb-2 text-lg">Rent Price (ETH)</label>
              <input
                type="number"
                id="rentPrice"
                className="input input-bordered w-full"
                value={Price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <div>
              <label htmlFor="shardCount" className="text-lg font-semibold">Shard Count:</label>
              <input
                type="number"
                id="shardCount"
                ref={shardCountInputRef} // Use ref to store shardCount value
                defaultValue={1} // Default value for shardCount
                min="1"
                className="input input-bordered w-full mt-2"
                placeholder="Enter number of shards"
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleActionButtonClick}
              className="flex bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
            >
              碎片化
            </button>
          </div>
          </div> */}
     {/* {!NftFragmentDetail?.[3]  && ( */}
          {!NftFragmentDetail?.[3]  && (
            <div>
              <div className="flex gap-4 mt-6">
                <div className="mb-4">
                  <label htmlFor="rentPrice" className="block mb-2 text-lg">Rent Price (ETH)</label>
                  <input
                    type="number"
                    id="rentPrice"
                    className="input input-bordered w-full"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <div>
                  <label htmlFor="shardCount" className="text-lg font-semibold">Shard Count:</label>
                  <input
                    type="number"
                    id="shardCount"
                    ref={shardCountInputRef} // Use ref to store shardCount value
                    defaultValue={1} // Default value for shardCount
                    min="1"
                    className="input input-bordered w-full mt-2"
                    placeholder="Enter number of shards"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleActionButtonClick}
                  className="flex bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
                >
                  碎片化
                </button>
              </div>
            </div>
          )}


        </div>

      </div>


      <div className="flex-grow">
        {metadata.image && img && (
          <div>
            <button onClick={toggleView} className="btn btn-secondary mb-4">
              {isSlicedView ? "Show Original" : "Show Sliced"}
            </button>

            <div>
              {isSlicedView ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: `${padding}px` }}>
                  <div className="flex flex-wrap gap-4 my-8 px-5 justify">
                    {FragmentCollectibles.map(nft => (
                      <FragNFTCard nft={nft} key={nft.fragId} />
                    ))}
                  </div>

                </div>

              ) : (

                <div style={{ padding: `${padding}px`, display: 'inline-block' }}>
                  <img src={reconstructedImageSrc || metadata.image || ''} alt="Reconstructed" style={{ display: 'block', margin: 'auto' }} />

                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default NFTDetails;