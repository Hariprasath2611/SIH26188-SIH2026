// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AuditLedger
 * @dev Smart Contract for IDShield AI storing SHA-256 tamper-evident verification proofs.
 */
contract AuditLedger {
    
    struct AuditRecord {
        string caseId;
        string documentHash;
        uint256 riskScore;
        string riskLevel;
        uint256 timestamp;
        string officerId;
    }

    mapping(string => AuditRecord) private records;
    string[] public caseIds;

    event AuditRecordCreated(
        string indexed caseId,
        string documentHash,
        uint256 riskScore,
        string riskLevel,
        uint256 timestamp,
        string officerId
    );

    function recordAudit(
        string memory _caseId,
        string memory _documentHash,
        uint256 _riskScore,
        string memory _riskLevel,
        string memory _officerId
    ) public {
        require(bytes(_caseId).length > 0, "Invalid Case ID");
        require(bytes(_documentHash).length > 0, "Invalid Document Hash");

        AuditRecord memory record = AuditRecord({
            caseId: _caseId,
            documentHash: _documentHash,
            riskScore: _riskScore,
            riskLevel: _riskLevel,
            timestamp: block.timestamp,
            officerId: _officerId
        });

        records[_caseId] = record;
        caseIds.push(_caseId);

        emit AuditRecordCreated(
            _caseId,
            _documentHash,
            _riskScore,
            _riskLevel,
            block.timestamp,
            _officerId
        );
    }

    function getAuditRecord(string memory _caseId) public view returns (
        string memory caseId,
        string memory documentHash,
        uint256 riskScore,
        string memory riskLevel,
        uint256 timestamp,
        string memory officerId
    ) {
        AuditRecord memory rec = records[_caseId];
        require(bytes(rec.caseId).length > 0, "Audit record not found");
        return (
            rec.caseId,
            rec.documentHash,
            rec.riskScore,
            rec.riskLevel,
            rec.timestamp,
            rec.officerId
        );
    }

    function totalRecords() public view returns (uint256) {
        return caseIds.length;
    }
}
