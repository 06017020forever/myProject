// import { ipfsClient } from "~~/utils/simpleNFT/ipfs";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const res = await ipfsClient.add(JSON.stringify(body));
//     return Response.json(res);
//   } catch (error) {
//     console.log("Error adding to ipfs", error);
//     return Response.json({ error: "Error adding to ipfs" });
//   }
// }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data =  JSON.stringify(body);   
 
    const pinataJWT ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZTM5MzA1MS1jODhlLTRmZTItOGMwYi0xN2RhYzA1NWUwZjYiLCJlbWFpbCI6IjIxMzQ0OTYzMDRAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjQ5M2E5ZWRiZWM4ZjBkYmU4ZTIwIiwic2NvcGVkS2V5U2VjcmV0IjoiNmY5Zjk4MTZmOTc4MjBkZGIyNzhlZjc0MjU2MjYzMjY2MjE3NTY5NGE3ZWM2NDE3OWU0MzA5YzA2NTQ0ZTNhZCIsImV4cCI6MTc2NjgwMzAxM30.qCgTbT4Clw2o0uzuG7DPwjMiJRIK0NwlPkTNW-C5ChQ';
    // console.log("PINATA_JWT", pinataJWT);
    if(!pinataJWT) {
    throw new Error("PINATA_JWT 不在环境变量中");
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: data,
    })
     
     if(!response.ok){
      throw new Error(`HTTP 错误！状态：${response.status}`);
     }
     const result = await response.json();
   
     return Response.json(result.IpfsHash);
     
  } catch (error) {
    console.log("Error getting metadata from ipfs", error);
    return Response.json({ error: "Error getting metadata from ipfs" });
  }
}
