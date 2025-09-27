#!/bin/bash

# This script compiles the circuit and sets up the proving keys.

CIRCUIT_NAME=donation
BUILD_DIR=../build

# Create a build directory if it doesn't exist
mkdir -p $BUILD_DIR

echo "Compiling ${CIRCUIT_NAME}.circom..."

# 1. Compile the circuit
circom ${CIRCUIT_NAME}.circom --r1cs --wasm --sym -o $BUILD_DIR

# Check if compilation was successful
if [ -f "${BUILD_DIR}/${CIRCUIT_NAME}.r1cs" ]; then
    echo "Circuit compiled successfully."
else
    echo "Error compiling circuit."
    exit 1
fi

echo "Setting up Groth16 proving system..."

# 2. Setup the proving system (using a dummy powers of tau for speed)
# IMPORTANT: In production, you MUST use a real powers of tau file from a trusted ceremony.
# We create a dummy one here for quick testing.
snarkjs powersoftau new bn128 12 ${BUILD_DIR}/pot12_0000.ptau -v
snarkjs powersoftau contribute ${BUILD_DIR}/pot12_0000.ptau ${BUILD_DIR}/pot12_0001.ptau --name="First contribution" -v

# 3. Generate the .zkey file (proving key and verification key)
snarkjs groth16 setup ${BUILD_DIR}/${CIRCUIT_NAME}.r1cs ${BUILD_DIR}/pot12_0001.ptau ${BUILD_DIR}/${CIRCUIT_NAME}_0000.zkey

# 4. Export the verification key
snarkjs zkey export verificationkey ${BUILD_DIR}/${CIRCUIT_NAME}_0000.zkey ${BUILD_DIR}/verification_key.json

echo "Setup complete!"
echo "Proving key: ${BUILD_DIR}/${CIRCUIT_NAME}_0000.zkey"
echo "Verification key: ${BUILD_DIR}/verification_key.json"
