// import geometries
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-123.94023196781397, 46.159829321802356],
          [-123.94023196781397, 46.10367938636918],
          [-123.85508792484522, 46.10367938636918],
          [-123.85508792484522, 46.159829321802356]]], null, false),
    LEWI = ee.FeatureCollection("users/gracestonecipher/LEWI"),
    geometry2 = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-124.819140625, 46.577514781790924],
          [-124.819140625, 45.52536012201724],
          [-122.99541015625, 45.52536012201724],
          [-122.99541015625, 46.577514781790924]]], null, false);

//set center of map and zoom level
Map.setCenter(-123.89937656009913,46.12664591788602, 13)

//create image collection of study area from 2007
var before_image_col = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
            .filterBounds(LEWI)
            .filterDate('2007-01-01','2007-12-31')
            .sort('CLOUD_COVER', false);
            
print(before_image_col)

//create image collection of study area from 2008
var after_image_col = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
            .filterBounds(LEWI)
            .filterDate('2008-01-01','2008-12-31')
            .sort('CLOUD_COVER', false);
            
print(after_image_col)

//pick images ~ 1 year apart (helps eliminate changes due to seasonal variability)
//before image from July 10, 2007
var before = ee.Image("LANDSAT/LT05/C01/T1_SR/LT05_047028_20070710").select(['B1','B2','B3','B4','B5','B6','B7'])

//after image from July 12, 2008
var after = ee.Image("LANDSAT/LT05/C01/T1_SR/LT05_047028_20080712").select(['B1','B2','B3','B4','B5','B6','B7'])
Map.addLayer(after, {bands:['B3','B2','B1'], min: 0, max:3000}, "True Color Image")

//add layers to map - true color and false color (432)
Map.addLayer(before, {bands:['B3','B2','B1'], min: 0, max:3000}, "Before True Color")
Map.addLayer(after, {bands:['B3','B2','B1'], min: 0, max:3000}, "After True Color")
Map.addLayer(before, {bands:['B4','B3','B2'], min: 0, max:3000}, "Before False Color")
Map.addLayer(after, {bands:['B4','B3','B2'], min: 0, max:3000}, "After False Color")

//add study area to map - Lewis & Clark National Historical Park
var styling = {color: 'purple', fillColor: '00000000'}
Map.addLayer(LEWI.style(styling))

Export.image.toDrive({
  image: before,
  description: 'lewi_studyarea_20070710',
  folder: 'GEE_Images',
  region: geometry,
  scale:30
})

Export.image.toDrive({
  image: after,
  description: 'lewi_studyarea_20080712',
  folder: 'GEE_Images',
  region: geometry,
  scale:30
})
