graph create smart-wallet-graph  --node http://127.0.0.1:8020


graph deploy smart-wallet-graph subgraph.yaml  --debug --ipfs  http://localhost:5001  --node http://127.0.0.1:8020  -l v1
