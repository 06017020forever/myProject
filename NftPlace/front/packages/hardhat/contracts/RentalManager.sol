// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./console.sol";

contract RentalManager is Ownable {
    struct Rental {
        uint256 tokenId;
        address renter;
        uint256 rentPrice;
        uint256 startTime;
        uint256 duration;
        uint256 endTime;
        address rentaler;
        uint256 cashPledge;
        bool active;
        string tokenUri;
    }

    mapping(uint256 => Rental) public rentals;

    event RentalCreated(
        uint256 tokenId,
        address rentaler,
        uint256 rentPrice,
        uint256 cashPledge
    );
    event NFTRented(
        uint256 tokenId,
        address renter,
        uint256 startTime,
        uint256 endTime
    );
    event RentalEnded(
        uint256 tokenId,
        address renter,
        address rentaler,
        uint256 cashPledgeReturned
    );

    function _createRental(
        uint256 tokenId,
        uint256 rentPrice,
        // uint256 duration,
        uint256 cashPledge,
        address rentaler
    ) internal {
        require(!rentals[tokenId].active, "The NFT is already rented out");

        rentals[tokenId] = Rental({
            tokenId: tokenId,
            renter: address(0),
            rentPrice: rentPrice,
            startTime: 0,
            duration: 0,
            endTime: 0,
            rentaler: rentaler,
            cashPledge: cashPledge,
            active: true,
            tokenUri: ""
        });

        emit RentalCreated(tokenId, rentaler, rentPrice, cashPledge);
    }

    function _rentNFT(uint256 tokenId, address renter,uint256 duration) internal {
        Rental storage rental = rentals[tokenId];
        require(rental.active, "The NFT is not available for rent");
        require(
            msg.value == rental.rentPrice + rental.cashPledge,
            "The rent price is not correct"
        );
        rental.renter = renter;
        rental.startTime = block.timestamp;
        rental.endTime = block.timestamp + duration;
        		// 临时转移NFT的所有权给租用者

        payable(rental.rentaler).transfer(rental.rentPrice);

        emit NFTRented(tokenId, renter,duration, rental.endTime);
    }

    function _endRental(uint256 tokenId, uint256 nowTimestamp) internal {
        Rental storage rental = rentals[tokenId];
        require(rental.active, "The NFT is not rented out");
        require(
            nowTimestamp >= rental.endTime,
            "The rental duration has not expired"
        );
        require(rental.renter != address(0), "Invalid renter address");

        address renter = rental.renter;
        address rentaler = rental.rentaler;
        uint256 cashPledge = rental.cashPledge;

        require(
            address(this).balance >= cashPledge,
            "Insufficient balance for cash pledge return"
        );
        console.log("address(this).balance", address(this).balance);

        rental.active = false;
        rental.renter = address(0);
        rental.startTime = 0;
        rental.endTime = 0;

        console.log("!!", renter);
        (bool success, ) = renter.call{ value: cashPledge }("");
        require(success, "Failed to return cash pledge to renter");

        emit RentalEnded(tokenId, renter, rentaler, cashPledge);
    }
}



// pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./console.sol";

// contract RentalManager is Ownable {
// 	struct Rental {
// 		uint256 tokenId;
// 		address renter;
// 		uint256 rentPrice;
// 		uint256 startTime;
// 		uint256 duration;
// 		uint256 endTime;
// 		address rentaler;
// 		uint256 cashPledge;
// 		bool active;
// 		string tokenUri;
// 	}

// 	mapping(uint256 => Rental) public rentals;

// 	event RentalCreated(
// 		uint256 tokenId,
// 		address rentaler,
// 		uint256 rentPrice,
// 		uint256 duration,
// 		uint256 cashPledge
// 	);
// 	event NFTRented(
// 		uint256 tokenId,
// 		address renter,
// 		uint256 startTime,
// 		uint256 endTime
// 	);

// 	event RentalEnded(
// 		uint256 tokenId,
// 		address renter,
// 		address rentaler,
// 		uint256 cashPledgeReturned
// 	);

// 	function createRental(
// 		uint256 tokenId,
// 		uint256 rentPrice,
// 		uint256 duration,
// 		uint256 cashPledge,
// 		address rentaler
// 	) public {
// 		require(!rentals[tokenId].active, "The NFT is already rented out");

// 		rentals[tokenId] = Rental({
// 			tokenId: tokenId,
// 			renter: address(0),
// 			rentPrice: rentPrice,
// 			startTime: 0,
// 			duration: duration,
// 			endTime: 0,
// 			rentaler: rentaler,
// 			cashPledge: cashPledge,
// 			active: true,
// 			tokenUri: ""
// 		});

// 		emit RentalCreated(tokenId, rentaler, rentPrice, duration, cashPledge);
// 	}

// 	function rentNFT(uint256 tokenId, address renter) external  payable {
// 		Rental storage rental = rentals[tokenId];
// 		require(rental.active, "The NFT is not available for rent");
// 		require(
// 			msg.value == rental.rentPrice + rental.cashPledge,
// 			"The rent price is not correct"
// 		);
// 		rental.renter = renter;
// 		rental.startTime = block.timestamp;
// 		rental.endTime = block.timestamp + rental.duration;
// 		payable(rental.rentaler).transfer(rental.rentPrice);

// 		emit NFTRented(tokenId, renter, rental.startTime, rental.endTime);
// 	}

// 	// function endRental(uint256 tokenId, uint256 nowTimetamp) public {
// 	// 	Rental storage rental = rentals[tokenId];
// 	// 	require(rental.active, "The NFT is not rented out");
// 	// 	require(
// 	// 		nowTimetamp >= rental.endTime,
// 	// 		"The rental duration has not expired"
// 	// 	);
// 	// 	require(rental.renter != address(0), "The NFT is not rented out");

// 	// 	address renter = rental.renter;
// 	// 	address rentaler = rental.rentaler;
// 	// 	uint256 cashPledge = rental.cashPledge;

// 	// 	rental.active = false;
// 	// 	rental.renter = address(0);
// 	// 	rental.startTime = 0;
// 	// 	rental.endTime = 0;
// 	// 	console.log("renter", cashPledge);
// 	// 	// Transfer the cash pledge back to the renter
// 	// 	payable(renter).transfer(cashPledge);

// 	// 	emit RentalEnded(tokenId, renter, rentaler);
// 	// }
// 	function endRental(uint256 tokenId, uint256 nowTimestamp) external   {
// 		Rental storage rental = rentals[tokenId];
// 		require(rental.active, "The NFT is not rented out");
// 		require(
// 			nowTimestamp >= rental.endTime,
// 			"The rental duration has not expired"
// 		);
// 		require(rental.renter != address(0), "Invalid renter address");

// 		address renter = rental.renter;
// 		address rentaler = rental.rentaler;
// 		uint256 cashPledge = rental.cashPledge;

// 		require(
// 			address(this).balance >= cashPledge,
// 			"Insufficient balance for cash pledge return"
// 		);
// 		console.log("address(this).balance", address(this).balance);

// 		rental.active = false;
// 		rental.renter = address(0);
// 		rental.startTime = 0;
// 		rental.endTime = 0;

// 		console.log("!!", renter);
// 		(bool success, ) = renter.call{ value: cashPledge }("");
// 		require(success, "Failed to return cash pledge to renter");

// 		emit RentalEnded(tokenId, renter, rentaler, cashPledge);
// 	}

// 	// Add more functions as needed for rental management
// }