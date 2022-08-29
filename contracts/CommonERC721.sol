// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token/ERC721/ERC2981.sol";
import "./token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "./utils/Counters.sol";

contract CommonERC721 is ERC721PresetMinterPauserAutoId, ERC2981 {
    using Strings for uint256;

    struct TokenMetadata {
        uint256 birthday;
        uint256 parent1;
        uint256 parent2;
        uint256 generation;
    }

    mapping(uint256 => TokenMetadata) tokenData;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721PresetMinterPauserAutoId(name, symbol, baseTokenURI) {

      royaltyWallet = _msgSender();

    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        tokenId.toString(),
                        "/metadata.json"
                    )
                )
                : "";
    }

    function getAlltokenIdByAddress(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = this.balanceOf(owner);
        uint256[] memory res = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            res[i] = this.tokenOfOwnerByIndex(owner, i);
        }

        return res;
    }

    function setBaseTokenURI(string memory baseTokenURI) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "CommonERC721: Only MINTER_ROLE can modify baseTokenURI");
        _baseTokenURI = baseTokenURI;
    }


    // 版稅
    event RoyaltyWalletChanged(address indexed previousWallet, address indexed newWallet);
    event RoyaltyFeeChanged(uint256 previousFee, uint256 newFee);

    uint256 public constant ROYALTY_FEE_DENOMINATOR = 100000;
    uint256 public royaltyFee = 0;
    address public royaltyWallet;

    /**
     * @dev Sets the wallet to which royalties should be sent
     * @param _royaltyWallet Address that should receive the royalties
     */
    function setRoyaltyWallet(address _royaltyWallet) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");
        _setRoyaltyWallet(_royaltyWallet);
    }

    /**
     * @dev Sets the fee percentage for royalties
     * @param _royaltyFee Basis points to compute royalty percentage
     */
    function setRoyaltyFee(uint256 _royaltyFee) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");
        _setRoyaltyFee(_royaltyFee);
    }

    /**
     * @dev Function defined by ERC2981, which provides information about fees.
     * @param value Price being paid for the token (in base units)
     */
    function royaltyInfo(
        uint256, // tokenId is not used in this case as all tokens take the same fee
        uint256 value
    )
        public view override returns (
            address, // receiver
            uint256 // royaltyAmount
        )
    {
        return (royaltyWallet, (value * royaltyFee) / ROYALTY_FEE_DENOMINATOR);
    }

    function _setRoyaltyWallet(address _royaltyWallet) internal {
        require(_royaltyWallet != address(0), "INVALID_WALLET");
        emit RoyaltyWalletChanged(royaltyWallet, _royaltyWallet);
        royaltyWallet = _royaltyWallet;
    }

    function _setRoyaltyFee(uint256 _royaltyFee) internal {
        require(_royaltyFee <= ROYALTY_FEE_DENOMINATOR, "INVALID_FEE");
        emit RoyaltyFeeChanged(royaltyFee, _royaltyFee);
        royaltyFee = _royaltyFee;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC2981, ERC721PresetMinterPauserAutoId) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

}
