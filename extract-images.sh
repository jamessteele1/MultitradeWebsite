#!/bin/bash
BASE=/Users/jamessteele1/Documents/multitrade-site/public/images/products
ZIP='/Users/jamessteele1/Documents/Site Files.zip'

echo "Extracting product images from Wix zip..."

for product in "12x6m-complex" "12x3-mobile-crib-room" "66x3m-self-contained-crib" "72x3m-self-contained-crib" "6x3-office" "6000l-waste-tank" "solar-toilet-6x24" "12x3-crib-room" "20ft-container" "6x3m-supervisor-office" "20ft-dg-container" "6x3-toilet" "10ft-container" "4000l-waste-tank" "96x3m-living-quarters" "42x3m-ablution" "20ft-high-cube" "36x24-toilet" "5000l-tank-pump" "20ft-container-office" "solar-facility" "gatehouse" "20ft-shelved-container" "stair-landing" "40ft-flat-rack" "12x3m-covered-deck" "road-barrier" "10ft-dg-container" "6x3-crib" "dual-hand-wash" "wash-trough" "12x3-office" "3x3-office"; do
  mkdir -p "$BASE/$product"
done

# Extract all 59f33f_* images from zip into a temp folder, then sort
TEMP="$BASE/_temp_all"
mkdir -p "$TEMP"
cd "$TEMP" && unzip -jo "$ZIP" "59f33f_*" 2>/dev/null

echo "Extracted $(ls "$TEMP" | wc -l) total Wix images"
echo "=== DONE ==="
echo "Images are in: $TEMP"
echo "Product folders ready in: $BASE"
