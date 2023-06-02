# Legal Packet Parser

Goal: Traverse a legal document and detect signature pages where relevant parties need to sign. Extract the signature pages and group them by Party (Buyer or seller) to be sent off signing. The page numbers need to be retained so they can be assembled into the document later for Deal closing. The signature pages are sometimes divided on a per party basis (one signature page for the seller, one signature page for the buyer).

The `sample_docs` folder contains a series of samples of stock purchase agreements and asset purchase agreements. Those Are DOC 1997-2003 format and more modern DOCX formats.

Potentials markers of signature pages might be 
* Header designations or footer designations
* The previous page might designate the following page is a signature page'
* Signature section may include underscores where the parties need to sign
* Nearly all signature pages can contain the phrases `By` `Name` `Title`, usually on the same page within a space or a line break of each other. See Sample docs for more clarity.

The formatting of the documents can be haphazrd if a firm is less strict on their formatting requirements. So a signature line might be inside a table, might be indented 4 times, might be be in a column on the page. Lawyers are wreckless.

### Future state desired
Once a signature page is signed, it should be merged back into the document for deal closing at the location which it was originally extracted from.

It may also be the case that simply identifying the signature pages and allowing for electronic signing of the documents is fine. Maybe flagging keys similar to how docu-sign does it. The issue is lawyers are old and like to touch........err.....documents.
