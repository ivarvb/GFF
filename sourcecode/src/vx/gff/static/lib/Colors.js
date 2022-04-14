/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function ColorPalette(id="rainbow") {
    var self = this;
    this.id = id;
    this.invert = false;

    this.COLORST = {
        "inferno":{"colors":["#000004","#010005","#010106","#010108","#02010a","#02020c","#02020e","#030210","#040312","#040314","#050417","#060419","#07051b","#08051d","#09061f","#0a0722","#0b0724","#0c0826","#0d0829","#0e092b","#10092d","#110a30","#120a32","#140b34","#150b37","#160b39","#180c3c","#190c3e","#1b0c41","#1c0c43","#1e0c45","#1f0c48","#210c4a","#230c4c","#240c4f","#260c51","#280b53","#290b55","#2b0b57","#2d0b59","#2f0a5b","#310a5c","#320a5e","#340a5f","#360961","#380962","#390963","#3b0964","#3d0965","#3e0966","#400a67","#420a68","#440a68","#450a69","#470b6a","#490b6a","#4a0c6b","#4c0c6b","#4d0d6c","#4f0d6c","#510e6c","#520e6d","#540f6d","#550f6d","#57106e","#59106e","#5a116e","#5c126e","#5d126e","#5f136e","#61136e","#62146e","#64156e","#65156e","#67166e","#69166e","#6a176e","#6c186e","#6d186e","#6f196e","#71196e","#721a6e","#741a6e","#751b6e","#771c6d","#781c6d","#7a1d6d","#7c1d6d","#7d1e6d","#7f1e6c","#801f6c","#82206c","#84206b","#85216b","#87216b","#88226a","#8a226a","#8c2369","#8d2369","#8f2469","#902568","#922568","#932667","#952667","#972766","#982766","#9a2865","#9b2964","#9d2964","#9f2a63","#a02a63","#a22b62","#a32c61","#a52c60","#a62d60","#a82e5f","#a92e5e","#ab2f5e","#ad305d","#ae305c","#b0315b","#b1325a","#b3325a","#b43359","#b63458","#b73557","#b93556","#ba3655","#bc3754","#bd3853","#bf3952","#c03a51","#c13a50","#c33b4f","#c43c4e","#c63d4d","#c73e4c","#c83f4b","#ca404a","#cb4149","#cc4248","#ce4347","#cf4446","#d04545","#d24644","#d34743","#d44842","#d54a41","#d74b3f","#d84c3e","#d94d3d","#da4e3c","#db503b","#dd513a","#de5238","#df5337","#e05536","#e15635","#e25734","#e35933","#e45a31","#e55c30","#e65d2f","#e75e2e","#e8602d","#e9612b","#ea632a","#eb6429","#eb6628","#ec6726","#ed6925","#ee6a24","#ef6c23","#ef6e21","#f06f20","#f1711f","#f1731d","#f2741c","#f3761b","#f37819","#f47918","#f57b17","#f57d15","#f67e14","#f68013","#f78212","#f78410","#f8850f","#f8870e","#f8890c","#f98b0b","#f98c0a","#f98e09","#fa9008","#fa9207","#fa9407","#fb9606","#fb9706","#fb9906","#fb9b06","#fb9d07","#fc9f07","#fca108","#fca309","#fca50a","#fca60c","#fca80d","#fcaa0f","#fcac11","#fcae12","#fcb014","#fcb216","#fcb418","#fbb61a","#fbb81d","#fbba1f","#fbbc21","#fbbe23","#fac026","#fac228","#fac42a","#fac62d","#f9c72f","#f9c932","#f9cb35","#f8cd37","#f8cf3a","#f7d13d","#f7d340","#f6d543","#f6d746","#f5d949","#f5db4c","#f4dd4f","#f4df53","#f4e156","#f3e35a","#f3e55d","#f2e661","#f2e865","#f2ea69","#f1ec6d","#f1ed71","#f1ef75","#f1f179","#f2f27d","#f2f482","#f3f586","#f3f68a","#f4f88e","#f5f992","#f6fa96","#f8fb9a","#f9fc9d","#fafda1","#fcffa4"]},
        "plasma":{"colors":["#310086", "#6100a0", "#9300a3", "#bb2885", "#d85969", "#ee884e", "#f5c03b", "#e5fb41"]},
        "oranges":{"colors":["#ffd830", "#f49900", "#f43e00", "#b9106a", "#8d2e01"]},
        "blues":{"colors":["#e8f1fa","#e7f1fa","#e7f0fa","#e6f0f9","#e5eff9","#e4eff9","#e3eef9","#e3eef8","#e2edf8","#e1edf8","#e0ecf8","#e0ecf7","#dfebf7","#deebf7","#ddeaf7","#ddeaf6","#dce9f6","#dbe9f6","#dae8f6","#d9e8f5","#d9e7f5","#d8e7f5","#d7e6f5","#d6e6f4","#d6e5f4","#d5e5f4","#d4e4f4","#d3e4f3","#d2e3f3","#d2e3f3","#d1e2f3","#d0e2f2","#cfe1f2","#cee1f2","#cde0f1","#cce0f1","#ccdff1","#cbdff1","#cadef0","#c9def0","#c8ddf0","#c7ddef","#c6dcef","#c5dcef","#c4dbee","#c3dbee","#c2daee","#c1daed","#c0d9ed","#bfd9ec","#bed8ec","#bdd8ec","#bcd7eb","#bbd7eb","#b9d6eb","#b8d5ea","#b7d5ea","#b6d4e9","#b5d4e9","#b4d3e9","#b2d3e8","#b1d2e8","#b0d1e7","#afd1e7","#add0e7","#acd0e6","#abcfe6","#a9cfe5","#a8cee5","#a7cde5","#a5cde4","#a4cce4","#a3cbe3","#a1cbe3","#a0cae3","#9ec9e2","#9dc9e2","#9cc8e1","#9ac7e1","#99c6e1","#97c6e0","#96c5e0","#94c4df","#93c3df","#91c3df","#90c2de","#8ec1de","#8dc0de","#8bc0dd","#8abfdd","#88bedc","#87bddc","#85bcdc","#84bbdb","#82bbdb","#81badb","#7fb9da","#7eb8da","#7cb7d9","#7bb6d9","#79b5d9","#78b5d8","#76b4d8","#75b3d7","#73b2d7","#72b1d7","#70b0d6","#6fafd6","#6daed5","#6caed5","#6badd5","#69acd4","#68abd4","#66aad3","#65a9d3","#63a8d2","#62a7d2","#61a7d1","#5fa6d1","#5ea5d0","#5da4d0","#5ba3d0","#5aa2cf","#59a1cf","#57a0ce","#569fce","#559ecd","#549ecd","#529dcc","#519ccc","#509bcb","#4f9acb","#4d99ca","#4c98ca","#4b97c9","#4a96c9","#4895c8","#4794c8","#4693c7","#4592c7","#4492c6","#4391c6","#4190c5","#408fc4","#3f8ec4","#3e8dc3","#3d8cc3","#3c8bc2","#3b8ac2","#3a89c1","#3988c1","#3787c0","#3686c0","#3585bf","#3484bf","#3383be","#3282bd","#3181bd","#3080bc","#2f7fbc","#2e7ebb","#2d7dbb","#2c7cba","#2b7bb9","#2a7ab9","#2979b8","#2878b8","#2777b7","#2676b6","#2574b6","#2473b5","#2372b4","#2371b4","#2270b3","#216fb3","#206eb2","#1f6db1","#1e6cb0","#1d6bb0","#1c6aaf","#1c69ae","#1b68ae","#1a67ad","#1966ac","#1865ab","#1864aa","#1763aa","#1662a9","#1561a8","#1560a7","#145fa6","#135ea5","#135da4","#125ca4","#115ba3","#115aa2","#1059a1","#1058a0","#0f579f","#0e569e","#0e559d","#0e549c","#0d539a","#0d5299","#0c5198","#0c5097","#0b4f96","#0b4e95","#0b4d93","#0b4c92","#0a4b91","#0a4a90","#0a498e","#0a488d","#09478c","#09468a","#094589","#094487","#094386","#094285","#094183","#084082","#083e80","#083d7f","#083c7d","#083b7c","#083a7a","#083979","#083877","#083776","#083674","#083573","#083471","#083370","#08326e","#08316d","#08306b"]},
        "greens":{"colors":["#e7f6e3","#e7f6e2","#e6f5e1","#e5f5e1","#e4f5e0","#e4f4df","#e3f4de","#e2f4dd","#e1f4dc","#e1f3dc","#e0f3db","#dff3da","#def2d9","#ddf2d8","#ddf2d7","#dcf1d6","#dbf1d5","#daf1d4","#d9f0d3","#d8f0d2","#d7efd1","#d6efd0","#d5efcf","#d4eece","#d4eece","#d3eecd","#d2edcb","#d1edca","#d0ecc9","#cfecc8","#ceecc7","#cdebc6","#ccebc5","#cbeac4","#caeac3","#c9eac2","#c8e9c1","#c6e9c0","#c5e8bf","#c4e8be","#c3e7bd","#c2e7bc","#c1e6bb","#c0e6b9","#bfe6b8","#bee5b7","#bde5b6","#bbe4b5","#bae4b4","#b9e3b3","#b8e3b2","#b7e2b0","#b6e2af","#b5e1ae","#b3e1ad","#b2e0ac","#b1e0ab","#b0dfaa","#aedfa8","#addea7","#acdea6","#abdda5","#aadca4","#a8dca3","#a7dba2","#a6dba0","#a5da9f","#a3da9e","#a2d99d","#a1d99c","#9fd89b","#9ed799","#9dd798","#9bd697","#9ad696","#99d595","#97d494","#96d492","#95d391","#93d390","#92d28f","#91d18e","#8fd18d","#8ed08c","#8ccf8a","#8bcf89","#8ace88","#88cd87","#87cd86","#85cc85","#84cb84","#82cb83","#81ca82","#80c981","#7ec980","#7dc87f","#7bc77e","#7ac77c","#78c67b","#77c57a","#75c479","#74c478","#72c378","#71c277","#6fc276","#6ec175","#6cc074","#6bbf73","#69bf72","#68be71","#66bd70","#65bc6f","#63bc6e","#62bb6e","#60ba6d","#5eb96c","#5db86b","#5bb86a","#5ab769","#58b668","#57b568","#56b467","#54b466","#53b365","#51b264","#50b164","#4eb063","#4daf62","#4caf61","#4aae61","#49ad60","#48ac5f","#46ab5e","#45aa5d","#44a95d","#42a85c","#41a75b","#40a75a","#3fa65a","#3ea559","#3ca458","#3ba357","#3aa257","#39a156","#38a055","#379f54","#369e54","#359d53","#349c52","#339b51","#329a50","#319950","#30984f","#2f974e","#2e964d","#2d954d","#2b944c","#2a934b","#29924a","#28914a","#279049","#268f48","#258f47","#248e47","#238d46","#228c45","#218b44","#208a43","#1f8943","#1e8842","#1d8741","#1c8640","#1b8540","#1a843f","#19833e","#18823d","#17813d","#16803c","#157f3b","#147e3a","#137d3a","#127c39","#117b38","#107a37","#107937","#0f7836","#0e7735","#0d7634","#0c7534","#0b7433","#0b7332","#0a7232","#097131","#087030","#086f2f","#076e2f","#066c2e","#066b2d","#056a2d","#05692c","#04682b","#04672b","#04662a","#03642a","#036329","#026228","#026128","#026027","#025e27","#015d26","#015c25","#015b25","#015a24","#015824","#015723","#005623","#005522","#005321","#005221","#005120","#005020","#004e1f","#004d1f","#004c1e","#004a1e","#00491d","#00481d","#00471c","#00451c","#00441b"]},
        "greys":{"colors":["#efefef","#eeeeee","#ededed","#ededed","#ececec","#ececec","#ebebeb","#eaeaea","#eaeaea","#e9e9e9","#e8e8e8","#e8e8e8","#e7e7e7","#e6e6e6","#e6e6e6","#e5e5e5","#e4e4e4","#e3e3e3","#e3e3e3","#e2e2e2","#e1e1e1","#e0e0e0","#e0e0e0","#dfdfdf","#dedede","#dddddd","#dddddd","#dcdcdc","#dbdbdb","#dadada","#dadada","#d9d9d9","#d8d8d8","#d7d7d7","#d6d6d6","#d6d6d6","#d5d5d5","#d4d4d4","#d3d3d3","#d2d2d2","#d1d1d1","#d1d1d1","#d0d0d0","#cfcfcf","#cecece","#cdcdcd","#cccccc","#cbcbcb","#cacaca","#c9c9c9","#c9c9c9","#c8c8c8","#c7c7c7","#c6c6c6","#c5c5c5","#c4c4c4","#c3c3c3","#c2c2c2","#c1c1c1","#c0c0c0","#bfbfbf","#bebebe","#bdbdbd","#bcbcbc","#bbbbbb","#bababa","#b9b9b9","#b8b8b8","#b6b6b6","#b5b5b5","#b4b4b4","#b3b3b3","#b2b2b2","#b1b1b1","#b0b0b0","#afafaf","#adadad","#acacac","#ababab","#aaaaaa","#a9a9a9","#a8a8a8","#a7a7a7","#a5a5a5","#a4a4a4","#a3a3a3","#a2a2a2","#a1a1a1","#9f9f9f","#9e9e9e","#9d9d9d","#9c9c9c","#9b9b9b","#9a9a9a","#989898","#979797","#969696","#959595","#949494","#939393","#919191","#909090","#8f8f8f","#8e8e8e","#8d8d8d","#8c8c8c","#8b8b8b","#8a8a8a","#888888","#878787","#868686","#858585","#848484","#838383","#828282","#818181","#808080","#7f7f7f","#7d7d7d","#7c7c7c","#7b7b7b","#7a7a7a","#797979","#787878","#777777","#767676","#757575","#747474","#737373","#727272","#717171","#6f6f6f","#6e6e6e","#6d6d6d","#6c6c6c","#6b6b6b","#6a6a6a","#696969","#686868","#676767","#666666","#656565","#646464","#636363","#626262","#606060","#5f5f5f","#5e5e5e","#5d5d5d","#5c5c5c","#5b5b5b","#5a5a5a","#595959","#575757","#565656","#555555","#545454","#535353","#525252","#505050","#4f4f4f","#4e4e4e","#4d4d4d","#4b4b4b","#4a4a4a","#494949","#484848","#464646","#454545","#444444","#424242","#414141","#404040","#3e3e3e","#3d3d3d","#3c3c3c","#3a3a3a","#393939","#383838","#363636","#353535","#343434","#323232","#313131","#303030","#2e2e2e","#2d2d2d","#2c2c2c","#2a2a2a","#292929","#282828","#262626","#252525","#242424","#232323","#212121","#202020","#1f1f1f","#1e1e1e","#1c1c1c","#1b1b1b","#1a1a1a","#191919","#181818","#161616","#151515","#141414","#131313","#121212","#101010","#0f0f0f","#0e0e0e","#0d0d0d","#0c0c0c","#0a0a0a","#090909","#080808","#070707","#060606","#050505","#030303","#020202","#010101","#000000"]},
        "PuRd":{"colors":["#ede7f2","#ece6f2","#ece6f1","#ebe5f1","#ebe4f1","#eae3f0","#eae3f0","#e9e2ef","#e9e1ef","#e8e0ef","#e8dfee","#e7deee","#e6dded","#e6dced","#e5dbec","#e5dbec","#e4daeb","#e4d9eb","#e3d7ea","#e3d6e9","#e2d5e9","#e1d4e8","#e1d3e8","#e0d2e7","#e0d1e7","#dfd0e6","#dfcfe5","#decee5","#decce4","#ddcbe4","#dccae3","#dcc9e2","#dbc8e2","#dbc7e1","#dac5e0","#dac4e0","#d9c3df","#d9c2df","#d8c0de","#d8bfdd","#d7bedd","#d7bddc","#d6bcdb","#d6badb","#d5b9da","#d5b8da","#d4b7d9","#d4b6d8","#d3b4d8","#d3b3d7","#d3b2d6","#d2b1d6","#d2b0d5","#d1aed5","#d1add4","#d1acd3","#d0abd3","#d0aad2","#d0a8d2","#d0a7d1","#cfa6d0","#cfa5d0","#cfa4cf","#cfa2ce","#cea1ce","#cea0cd","#ce9fcd","#ce9dcc","#ce9ccb","#ce9bcb","#ce9aca","#ce98c9","#ce97c9","#ce96c8","#ce94c7","#ce93c7","#cf92c6","#cf91c5","#cf8fc5","#cf8ec4","#d08cc3","#d08bc3","#d08ac2","#d188c1","#d187c1","#d186c0","#d284bf","#d283bf","#d381be","#d380bd","#d47ebc","#d47dbc","#d57bbb","#d57aba","#d678b9","#d677b8","#d775b8","#d774b7","#d872b6","#d871b5","#d96fb4","#d96db3","#da6cb3","#da6ab2","#db69b1","#db67b0","#dc65af","#dc64ae","#dd62ad","#dd60ac","#de5fab","#de5daa","#df5ba9","#df59a8","#df58a7","#e056a6","#e054a5","#e053a4","#e151a3","#e14fa2","#e14da0","#e24c9f","#e24a9e","#e2489d","#e2479c","#e2459b","#e24399","#e24298","#e34097","#e33e96","#e33d94","#e33b93","#e33a92","#e33890","#e2378f","#e2358e","#e2348c","#e2328b","#e2318a","#e23088","#e12e87","#e12d85","#e12c84","#e02b82","#e02a81","#df2880","#df277e","#df267d","#de257b","#dd247a","#dd2378","#dc2277","#dc2175","#db2074","#da2072","#d91f71","#d91e6f","#d81d6e","#d71c6d","#d61b6b","#d51b6a","#d41a68","#d31967","#d21866","#d11864","#d01763","#cf1662","#ce1661","#cd155f","#cc145e","#cb145d","#c9135c","#c8125b","#c7125a","#c61159","#c41058","#c31057","#c20f56","#c00f55","#bf0e54","#bd0d53","#bc0d52","#ba0c51","#b90c50","#b70b4f","#b60b4f","#b40a4e","#b30a4d","#b1094c","#b0094b","#ae084b","#ac084a","#ab0749","#a90748","#a80648","#a60647","#a40546","#a30545","#a10544","#a00444","#9e0443","#9c0442","#9b0341","#990340","#97033f","#96033f","#94023e","#93023d","#91023c","#8f023b","#8e013a","#8c0139","#8b0138","#890137","#880136","#860135","#840134","#830133","#810032","#800031","#7e0030","#7d002f","#7b002d","#79002c","#78002b","#76002a","#750029","#730028","#720027","#700026","#6f0025","#6d0024","#6c0022","#6a0021","#690020","#67001f"]},
        "PdPu":{"colors":["#feeae6","#fee9e6","#fee8e5","#fee8e4","#fee7e3","#fee6e3","#fee5e2","#fee5e1","#fde4e0","#fde3e0","#fde2df","#fde2de","#fde1dd","#fde0dd","#fddfdc","#fddedb","#fddeda","#fdddd9","#fddcd8","#fddbd8","#fddad7","#fddad6","#fdd9d5","#fdd8d4","#fdd7d4","#fdd6d3","#fdd5d2","#fdd5d1","#fdd4d0","#fdd3cf","#fcd2cf","#fcd1ce","#fcd0cd","#fccfcc","#fccecb","#fccecb","#fccdca","#fcccc9","#fccbc8","#fccac8","#fcc9c7","#fcc8c6","#fcc7c5","#fcc6c5","#fcc5c4","#fcc4c3","#fcc3c3","#fcc2c2","#fcc1c2","#fcc0c1","#fcbfc0","#fcbec0","#fcbdbf","#fbbbbf","#fbbabe","#fbb9be","#fbb8bd","#fbb7bd","#fbb6bc","#fbb5bc","#fbb3bb","#fbb2bb","#fbb1bb","#fbb0ba","#fbafba","#fbadb9","#fbacb9","#fbabb8","#fba9b8","#faa8b7","#faa7b7","#faa5b7","#faa4b6","#faa3b6","#faa1b5","#faa0b5","#fa9fb4","#fa9db4","#fa9cb3","#fa9ab3","#fa99b2","#fa97b2","#f996b1","#f994b1","#f993b0","#f991b0","#f98faf","#f98eaf","#f98cae","#f98bae","#f989ad","#f887ac","#f886ac","#f884ab","#f882ab","#f881aa","#f87faa","#f77ea9","#f77ca9","#f77aa8","#f778a7","#f677a7","#f675a6","#f673a6","#f572a5","#f570a5","#f56ea4","#f46da4","#f46ba3","#f369a3","#f368a2","#f266a2","#f264a2","#f163a1","#f161a1","#f05fa0","#f05ea0","#ef5c9f","#ee5a9f","#ee599f","#ed579e","#ec559e","#ec549d","#eb529d","#ea509c","#e94f9c","#e94d9c","#e84c9b","#e74a9b","#e6489a","#e5479a","#e4459a","#e34399","#e24299","#e14098","#e03e98","#df3d97","#de3b97","#dd3a96","#dc3896","#db3695","#da3595","#d93394","#d83294","#d63093","#d52e92","#d42d92","#d32b91","#d12a91","#d02890","#cf268f","#ce258f","#cc238e","#cb228d","#ca208d","#c81f8c","#c71d8b","#c51c8b","#c41b8a","#c31989","#c11889","#c01788","#be1588","#bd1487","#bb1386","#ba1286","#b81185","#b70f84","#b50e84","#b40d83","#b20c83","#b10b82","#af0b82","#ae0a81","#ac0981","#aa0880","#a90780","#a7077f","#a6067f","#a4067e","#a3057e","#a1057e","#9f047d","#9e047d","#9c037c","#9b037c","#99037c","#97037b","#96027b","#94027b","#93027a","#91027a","#8f027a","#8e017a","#8c0179","#8b0179","#890179","#870178","#860178","#840178","#830178","#810177","#7f0177","#7e0177","#7c0176","#7b0176","#790176","#780175","#760175","#740175","#730174","#710174","#700174","#6e0173","#6d0173","#6b0173","#690172","#680172","#660172","#650171","#630171","#620070","#600070","#5f0070","#5d006f","#5b006f","#5a006e","#58006e","#57006e","#55006d","#54006d","#52006c","#51006c","#4f006c","#4e006b","#4c006b","#4b006a","#49006a"]},
        "cool":{"colors":["#6e40aa","#6d41ab","#6d41ad","#6d42ae","#6c43af","#6c43b0","#6b44b2","#6b45b3","#6a46b4","#6a46b5","#6a47b7","#6948b8","#6849b9","#684aba","#674abb","#674bbd","#664cbe","#664dbf","#654ec0","#654fc1","#6450c2","#6350c3","#6351c4","#6252c5","#6153c6","#6154c7","#6055c8","#5f56c9","#5f57ca","#5e58cb","#5d59cc","#5c5acd","#5c5bce","#5b5ccf","#5a5dd0","#595ed1","#595fd1","#5860d2","#5761d3","#5662d4","#5663d5","#5564d5","#5465d6","#5366d7","#5267d7","#5168d8","#5169d9","#506ad9","#4f6bda","#4e6cda","#4d6ddb","#4c6edb","#4b70dc","#4b71dc","#4a72dd","#4973dd","#4874de","#4775de","#4676df","#4577df","#4479df","#447adf","#437be0","#427ce0","#417de0","#407ee0","#3f80e1","#3e81e1","#3d82e1","#3d83e1","#3c84e1","#3b86e1","#3a87e1","#3988e1","#3889e1","#378ae1","#378ce1","#368de1","#358ee1","#348fe1","#3390e1","#3292e1","#3293e1","#3194e0","#3095e0","#2f96e0","#2e98e0","#2e99df","#2d9adf","#2c9bdf","#2b9cde","#2b9ede","#2a9fdd","#29a0dd","#29a1dd","#28a2dc","#27a4dc","#26a5db","#26a6db","#25a7da","#25a8d9","#24aad9","#23abd8","#23acd8","#22add7","#22aed6","#21afd5","#21b1d5","#20b2d4","#20b3d3","#1fb4d2","#1fb5d2","#1eb6d1","#1eb8d0","#1db9cf","#1dbace","#1dbbcd","#1cbccc","#1cbdcc","#1cbecb","#1bbfca","#1bc0c9","#1bc2c8","#1ac3c7","#1ac4c6","#1ac5c5","#1ac6c4","#1ac7c2","#1ac8c1","#19c9c0","#19cabf","#19cbbe","#19ccbd","#19cdbc","#19cebb","#19cfb9","#19d0b8","#19d1b7","#19d2b6","#19d3b5","#1ad4b4","#1ad5b2","#1ad5b1","#1ad6b0","#1ad7af","#1bd8ad","#1bd9ac","#1bdaab","#1bdbaa","#1cdba8","#1cdca7","#1cdda6","#1ddea4","#1ddfa3","#1edfa2","#1ee0a0","#1fe19f","#1fe29e","#20e29d","#20e39b","#21e49a","#22e599","#22e597","#23e696","#24e795","#24e793","#25e892","#26e891","#27e98f","#27ea8e","#28ea8d","#29eb8c","#2aeb8a","#2bec89","#2cec88","#2ded87","#2eed85","#2fee84","#30ee83","#31ef82","#32ef80","#33f07f","#34f07e","#35f07d","#37f17c","#38f17a","#39f279","#3af278","#3bf277","#3df376","#3ef375","#3ff374","#41f373","#42f471","#43f470","#45f46f","#46f46e","#48f56d","#49f56c","#4bf56b","#4cf56a","#4ef56a","#4ff669","#51f668","#52f667","#54f666","#55f665","#57f664","#59f664","#5af663","#5cf662","#5ef661","#5ff761","#61f760","#63f75f","#64f75f","#66f75e","#68f75d","#6af75d","#6bf65c","#6df65c","#6ff65b","#71f65b","#73f65a","#74f65a","#76f659","#78f659","#7af659","#7cf658","#7ef658","#80f558","#81f558","#83f557","#85f557","#87f557","#89f557","#8bf457","#8df457","#8ff457","#91f457","#93f457","#94f357","#96f357","#98f357","#9af357","#9cf257","#9ef258","#a0f258","#a2f258","#a4f158","#a6f159","#a8f159","#aaf159","#abf05a","#adf05a","#aff05b"]},
        "turbo":{"colors":["#23171b", "#271a28", "#2b1c33", "#2f1e3f", "#32204a", "#362354", "#39255f", "#3b2768", "#3e2a72", "#402c7b", "#422f83", "#44318b", "#453493", "#46369b", "#4839a2", "#493ca8", "#493eaf", "#4a41b5", "#4a44bb", "#4b46c0", "#4b49c5", "#4b4cca", "#4b4ecf", "#4b51d3", "#4a54d7", "#4a56db", "#4959de", "#495ce2", "#485fe5", "#4761e7", "#4664ea", "#4567ec", "#446aee", "#446df0", "#426ff2", "#4172f3", "#4075f5", "#3f78f6", "#3e7af7", "#3d7df7", "#3c80f8", "#3a83f9", "#3985f9", "#3888f9", "#378bf9", "#368df9", "#3590f8", "#3393f8", "#3295f7", "#3198f7", "#309bf6", "#2f9df5", "#2ea0f4", "#2da2f3", "#2ca5f1", "#2ba7f0", "#2aaaef", "#2aaced", "#29afec", "#28b1ea", "#28b4e8", "#27b6e6", "#27b8e5", "#26bbe3", "#26bde1", "#26bfdf", "#25c1dc", "#25c3da", "#25c6d8", "#25c8d6", "#25cad3", "#25ccd1", "#25cecf", "#26d0cc", "#26d2ca", "#26d4c8", "#27d6c5", "#27d8c3", "#28d9c0", "#29dbbe", "#29ddbb", "#2adfb8", "#2be0b6", "#2ce2b3", "#2de3b1", "#2ee5ae", "#30e6ac", "#31e8a9", "#32e9a6", "#34eba4", "#35eca1", "#37ed9f", "#39ef9c", "#3af09a", "#3cf197", "#3ef295", "#40f392", "#42f490", "#44f58d", "#46f68b", "#48f788", "#4af786", "#4df884", "#4ff981", "#51fa7f", "#54fa7d", "#56fb7a", "#59fb78", "#5cfc76", "#5efc74", "#61fd71", "#64fd6f", "#66fd6d", "#69fd6b", "#6cfd69", "#6ffe67", "#72fe65", "#75fe63", "#78fe61", "#7bfe5f", "#7efd5d", "#81fd5c", "#84fd5a", "#87fd58", "#8afc56", "#8dfc55", "#90fb53", "#93fb51", "#96fa50", "#99fa4e", "#9cf94d", "#9ff84b", "#a2f84a", "#a6f748", "#a9f647", "#acf546", "#aff444", "#b2f343", "#b5f242", "#b8f141", "#bbf03f", "#beef3e", "#c1ed3d", "#c3ec3c", "#c6eb3b", "#c9e93a", "#cce839", "#cfe738", "#d1e537", "#d4e336", "#d7e235", "#d9e034", "#dcdf33", "#dedd32", "#e0db32", "#e3d931", "#e5d730", "#e7d52f", "#e9d42f", "#ecd22e", "#eed02d", "#f0ce2c", "#f1cb2c", "#f3c92b", "#f5c72b", "#f7c52a", "#f8c329", "#fac029", "#fbbe28", "#fdbc28", "#feb927", "#ffb727", "#ffb526", "#ffb226", "#ffb025", "#ffad25", "#ffab24", "#ffa824", "#ffa623", "#ffa323", "#ffa022", "#ff9e22", "#ff9b21", "#ff9921", "#ff9621", "#ff9320", "#ff9020", "#ff8e1f", "#ff8b1f", "#ff881e", "#ff851e", "#ff831d", "#ff801d", "#ff7d1d", "#ff7a1c", "#ff781c", "#ff751b", "#ff721b", "#ff6f1a", "#fd6c1a", "#fc6a19", "#fa6719", "#f96418", "#f76118", "#f65f18", "#f45c17", "#f25916", "#f05716", "#ee5415", "#ec5115", "#ea4f14", "#e84c14", "#e64913", "#e44713", "#e24412", "#df4212", "#dd3f11", "#da3d10", "#d83a10", "#d5380f", "#d3360f", "#d0330e", "#ce310d", "#cb2f0d", "#c92d0c", "#c62a0b", "#c3280b", "#c1260a", "#be2409", "#bb2309", "#b92108", "#b61f07", "#b41d07", "#b11b06", "#af1a05", "#ac1805", "#aa1704", "#a81604", "#a51403", "#a31302", "#a11202", "#9f1101", "#9d1000", "#9b0f00", "#9a0e00", "#980e00", "#960d00", "#950c00", "#940c00", "#930c00", "#920c00", "#910b00", "#910c00", "#900c00", "#900c00", "#900c00"]},
        "rainbow":{"colors":["#6e40aa", "#7140ab", "#743fac", "#773fad", "#7a3fae", "#7d3faf", "#803eb0", "#833eb0", "#873eb1", "#8a3eb2", "#8d3eb2", "#903db2", "#943db3", "#973db3", "#9a3db3", "#9d3db3", "#a13db3", "#a43db3", "#a73cb3", "#aa3cb2", "#ae3cb2", "#b13cb2", "#b43cb1", "#b73cb0", "#ba3cb0", "#be3caf", "#c13dae", "#c43dad", "#c73dac", "#ca3dab", "#cd3daa", "#d03ea9", "#d33ea7", "#d53ea6", "#d83fa4", "#db3fa3", "#de3fa1", "#e040a0", "#e3409e", "#e5419c", "#e8429a", "#ea4298", "#ed4396", "#ef4494", "#f14592", "#f34590", "#f5468e", "#f7478c", "#f9488a", "#fb4987", "#fd4a85", "#fe4b83", "#ff4d80", "#ff4e7e", "#ff4f7b", "#ff5079", "#ff5276", "#ff5374", "#ff5572", "#ff566f", "#ff586d", "#ff596a", "#ff5b68", "#ff5d65", "#ff5e63", "#ff6060", "#ff625e", "#ff645b", "#ff6659", "#ff6857", "#ff6a54", "#ff6c52", "#ff6e50", "#ff704e", "#ff724c", "#ff744a", "#ff7648", "#ff7946", "#ff7b44", "#ff7d42", "#ff8040", "#ff823e", "#ff843d", "#ff873b", "#ff893a", "#ff8c38", "#ff8e37", "#fe9136", "#fd9334", "#fb9633", "#f99832", "#f89b32", "#f69d31", "#f4a030", "#f2a32f", "#f0a52f", "#eea82f", "#ecaa2e", "#eaad2e", "#e8b02e", "#e6b22e", "#e4b52e", "#e2b72f", "#e0ba2f", "#debc30", "#dbbf30", "#d9c131", "#d7c432", "#d5c633", "#d3c934", "#d1cb35", "#cece36", "#ccd038", "#cad239", "#c8d53b", "#c6d73c", "#c4d93e", "#c2db40", "#c0dd42", "#bee044", "#bce247", "#bae449", "#b8e64b", "#b6e84e", "#b5ea51", "#b3eb53", "#b1ed56", "#b0ef59", "#adf05a", "#aaf159", "#a6f159", "#a2f258", "#9ef258", "#9af357", "#96f357", "#93f457", "#8ff457", "#8bf457", "#87f557", "#83f557", "#80f558", "#7cf658", "#78f659", "#74f65a", "#71f65b", "#6df65c", "#6af75d", "#66f75e", "#63f75f", "#5ff761", "#5cf662", "#59f664", "#55f665", "#52f667", "#4ff669", "#4cf56a", "#49f56c", "#46f46e", "#43f470", "#41f373", "#3ef375", "#3bf277", "#39f279", "#37f17c", "#34f07e", "#32ef80", "#30ee83", "#2eed85", "#2cec88", "#2aeb8a", "#28ea8d", "#27e98f", "#25e892", "#24e795", "#22e597", "#21e49a", "#20e29d", "#1fe19f", "#1edfa2", "#1ddea4", "#1cdca7", "#1bdbaa", "#1bd9ac", "#1ad7af", "#1ad5b1", "#1ad4b4", "#19d2b6", "#19d0b8", "#19cebb", "#19ccbd", "#19cabf", "#1ac8c1", "#1ac6c4", "#1ac4c6", "#1bc2c8", "#1bbfca", "#1cbdcc", "#1dbbcd", "#1db9cf", "#1eb6d1", "#1fb4d2", "#20b2d4", "#21afd5", "#22add7", "#23abd8", "#25a8d9", "#26a6db", "#27a4dc", "#29a1dd", "#2a9fdd", "#2b9cde", "#2d9adf", "#2e98e0", "#3095e0", "#3293e1", "#3390e1", "#358ee1", "#378ce1", "#3889e1", "#3a87e1", "#3c84e1", "#3d82e1", "#3f80e1", "#417de0", "#437be0", "#4479df", "#4676df", "#4874de", "#4a72dd", "#4b70dc", "#4d6ddb", "#4f6bda", "#5169d9", "#5267d7", "#5465d6", "#5663d5", "#5761d3", "#595fd1", "#5a5dd0", "#5c5bce", "#5d59cc", "#5f57ca", "#6055c8", "#6153c6", "#6351c4", "#6450c2", "#654ec0", "#664cbe", "#674abb", "#6849b9", "#6a47b7", "#6a46b4", "#6b44b2", "#6c43af", "#6d41ad", "#6e40aa"]},
        "viridis":{"colors":["#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a","#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e","#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989","#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d","#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e","#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e","#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b","#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82","#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73","#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c","#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e","#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d","#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"]},
        "warm":{"colors":["#6e40aa","#6f40aa","#7140ab","#723fac","#743fac","#753fad","#773fad","#783fae","#7a3fae","#7c3faf","#7d3faf","#7f3faf","#803eb0","#823eb0","#833eb0","#853eb1","#873eb1","#883eb1","#8a3eb2","#8b3eb2","#8d3eb2","#8f3db2","#903db2","#923db3","#943db3","#953db3","#973db3","#983db3","#9a3db3","#9c3db3","#9d3db3","#9f3db3","#a13db3","#a23db3","#a43db3","#a63cb3","#a73cb3","#a93cb3","#aa3cb2","#ac3cb2","#ae3cb2","#af3cb2","#b13cb2","#b23cb1","#b43cb1","#b63cb1","#b73cb0","#b93cb0","#ba3cb0","#bc3caf","#be3caf","#bf3caf","#c13dae","#c23dae","#c43dad","#c53dad","#c73dac","#c83dac","#ca3dab","#cb3daa","#cd3daa","#ce3da9","#d03ea9","#d13ea8","#d33ea7","#d43ea7","#d53ea6","#d73ea5","#d83fa4","#da3fa4","#db3fa3","#dc3fa2","#de3fa1","#df40a0","#e040a0","#e2409f","#e3409e","#e4419d","#e5419c","#e7419b","#e8429a","#e94299","#ea4298","#eb4397","#ed4396","#ee4395","#ef4494","#f04493","#f14592","#f24591","#f34590","#f4468f","#f5468e","#f6478d","#f7478c","#f8488b","#f9488a","#fa4988","#fb4987","#fc4a86","#fd4a85","#fe4b84","#fe4b83","#ff4c81","#ff4d80","#ff4d7f","#ff4e7e","#ff4e7d","#ff4f7b","#ff507a","#ff5079","#ff5178","#ff5276","#ff5275","#ff5374","#ff5473","#ff5572","#ff5570","#ff566f","#ff576e","#ff586d","#ff586b","#ff596a","#ff5a69","#ff5b68","#ff5c66","#ff5d65","#ff5d64","#ff5e63","#ff5f61","#ff6060","#ff615f","#ff625e","#ff635d","#ff645b","#ff655a","#ff6659","#ff6758","#ff6857","#ff6956","#ff6a54","#ff6b53","#ff6c52","#ff6d51","#ff6e50","#ff6f4f","#ff704e","#ff714d","#ff724c","#ff734b","#ff744a","#ff7549","#ff7648","#ff7847","#ff7946","#ff7a45","#ff7b44","#ff7c43","#ff7d42","#ff7e41","#ff8040","#ff813f","#ff823e","#ff833d","#ff843d","#ff863c","#ff873b","#ff883a","#ff893a","#ff8a39","#ff8c38","#ff8d37","#ff8e37","#ff8f36","#fe9136","#fd9235","#fd9334","#fc9534","#fb9633","#fa9733","#f99832","#f99a32","#f89b32","#f79c31","#f69d31","#f59f30","#f4a030","#f3a130","#f2a32f","#f1a42f","#f0a52f","#efa62f","#eea82f","#eda92e","#ecaa2e","#ebac2e","#eaad2e","#e9ae2e","#e8b02e","#e7b12e","#e6b22e","#e5b32e","#e4b52e","#e3b62e","#e2b72f","#e1b92f","#e0ba2f","#dfbb2f","#debc30","#ddbe30","#dbbf30","#dac030","#d9c131","#d8c331","#d7c432","#d6c532","#d5c633","#d4c833","#d3c934","#d2ca34","#d1cb35","#cfcc36","#cece36","#cdcf37","#ccd038","#cbd138","#cad239","#c9d33a","#c8d53b","#c7d63c","#c6d73c","#c5d83d","#c4d93e","#c3da3f","#c2db40","#c1dc41","#c0dd42","#bfdf43","#bee044","#bde146","#bce247","#bbe348","#bae449","#b9e54a","#b8e64b","#b7e74d","#b6e84e","#b6e94f","#b5ea51","#b4ea52","#b3eb53","#b2ec55","#b1ed56","#b1ee58","#b0ef59","#aff05b"]},
        "spectral":{"colors":["#9e0142","#a00343","#a20643","#a40844","#a70b44","#a90d45","#ab0f45","#ad1245","#af1446","#b11646","#b31947","#b51b47","#b71d48","#ba2048","#bc2248","#be2449","#c02749","#c12949","#c32b4a","#c52d4a","#c7304a","#c9324a","#cb344b","#cd364b","#ce384b","#d03b4b","#d23d4b","#d33f4b","#d5414b","#d7434b","#d8454b","#da474a","#db494a","#dd4b4a","#de4d4a","#df4f4a","#e1514a","#e2534a","#e35549","#e45749","#e65949","#e75b49","#e85d49","#e95f49","#ea6149","#eb6349","#ec6549","#ed6749","#ee6a49","#ef6c49","#f06e4a","#f0704a","#f1724a","#f2744b","#f3774b","#f3794c","#f47b4d","#f47e4d","#f5804e","#f6824f","#f68550","#f78750","#f78951","#f88c52","#f88e53","#f89154","#f99356","#f99557","#f99858","#fa9a59","#fa9c5a","#fa9f5c","#fba15d","#fba35e","#fba660","#fba861","#fcaa62","#fcad64","#fcaf65","#fcb167","#fcb368","#fcb56a","#fdb86b","#fdba6d","#fdbc6e","#fdbe70","#fdc071","#fdc273","#fdc474","#fdc676","#fdc878","#fdca79","#fecc7b","#fecd7d","#fecf7e","#fed180","#fed382","#fed584","#fed685","#fed887","#feda89","#fedb8b","#fedd8d","#fede8f","#fee090","#fee192","#fee394","#fee496","#fee698","#fee79a","#fee89b","#feea9d","#feeb9f","#feeca1","#feeda2","#feefa4","#fef0a5","#fef1a7","#fef2a8","#fdf3a9","#fdf3aa","#fdf4ab","#fdf5ac","#fcf6ad","#fcf6ae","#fcf7af","#fbf7af","#fbf8b0","#faf8b0","#faf9b0","#f9f9b0","#f9f9b0","#f8f9b0","#f7faaf","#f7faaf","#f6faae","#f5faae","#f4f9ad","#f3f9ac","#f2f9ac","#f2f9ab","#f0f9aa","#eff8a9","#eef8a8","#edf8a7","#ecf7a7","#ebf7a6","#e9f6a5","#e8f6a4","#e7f5a3","#e5f5a2","#e4f4a2","#e2f3a1","#e0f3a1","#dff2a0","#ddf1a0","#dbf19f","#d9f09f","#d7ef9f","#d6ee9f","#d4ee9f","#d2ed9e","#d0ec9e","#cdeb9f","#cbea9f","#c9e99f","#c7e89f","#c5e89f","#c3e79f","#c0e6a0","#bee5a0","#bce4a0","#b9e3a0","#b7e2a1","#b4e1a1","#b2e0a1","#b0dfa1","#addea2","#abdda2","#a8dca2","#a6dba3","#a3daa3","#a0d9a3","#9ed8a3","#9bd7a3","#99d6a4","#96d5a4","#94d4a4","#91d3a4","#8ed1a4","#8cd0a4","#89cfa5","#87cea5","#84cda5","#82cba5","#7fcaa6","#7dc9a6","#7ac7a6","#77c6a6","#75c5a7","#73c3a7","#70c2a8","#6ec0a8","#6bbea8","#69bda9","#66bba9","#64b9aa","#62b8aa","#60b6ab","#5db4ac","#5bb2ac","#59b0ad","#57aeae","#55acae","#53aaaf","#51a8af","#50a6b0","#4ea4b1","#4ca2b1","#4ba0b2","#499db2","#489bb3","#4799b3","#4697b3","#4595b4","#4492b4","#4390b4","#438eb4","#428cb5","#4289b5","#4287b4","#4285b4","#4283b4","#4280b4","#437eb3","#437cb3","#447ab3","#4577b2","#4575b1","#4673b1","#4771b0","#486eaf","#4a6caf","#4b6aae","#4c68ad","#4e65ac","#4f63ab","#5161aa","#525fa9","#545ca8","#555aa7","#5758a6","#5956a5","#5b53a4","#5c51a3","#5e4fa2"]},
    };

    this.shift = function(){
        var auxc = [];
        var shiftv = self.COLORST[self.id]["colors"].length-1;
        for(var i in self.COLORST[self.id]["colors"]){
            auxc.push(self.COLORST[self.id]["colors"][shiftv-i]);
        }
        self.COLORST[self.id]["colors"] = auxc;
    };

    this.interpolate = function(){
        return d3.interpolateRgbBasis(self.COLORST[self.id]["colors"]);
    };

    this.makeSelectionColorPalette = function(w, h){    
        gelem("idwinmodalcolor").style.display = "block"; 
        gelem("idwinmodalcolortitle").innerHTML = "Change colors"; 
        gelem("idwinmodalcolorbody").innerHTML = "";
      
        //var cf = new ColorPalette();
        //var cf = CF.interpolate();
        var txtcol = `<table class="table table-striped table-responsive-md btn-table" style="margin: 0 auto">`;
        txtcol += "<thead>"
        txtcol += `<tr>
                        <th>Name</th>
                        <th>
                            <div>
                                <div style="float: left;">Min</div>
                                <div style="float: right;">Max</div>
                            </div>
                        </th>
                        <th>Shift</th>
                        <th>Pick</th>
                    <tr>`;
        txtcol += "</thead>"
        txtcol += "<tbody>"
        //console.log("cf.colorsopt", cf.COLORST);
        for(var i in CCTT.COLORST){
            idt = `tcoloridx`+i+``;
    
            txtcol += `<tr title="Chosse">`;
            txtcol += `<td>`+i+`</td>`;
            txtcol += `<td>`;
            txtcol += `<div id="`+idt+`" style="text-align:center"></div>`;
            txtcol += `</td>`;
            txtcol += `<td style="text-align:center">`;
            txtcol += `
            <a href="#" class="btn btn-dark btn-sm"
                style="padding: 1px;"
                onclick="
                    CCTT.id = '`+i+`';
                    CCTT.shift();
                    ci = CCTT.interpolate();
                    CCTT.drawcolorpalette('#`+idt+`', `+w+`, `+h+`, ci);
                "
                title="Invert"
            >
                <i class="fas fa-exchange-alt fa-lg"></i>
            </a>`;
            txtcol += `</td>`;
            txtcol += `<td style="text-align:center">`;
            txtcol += `
            <a href="#" class="btn btn-primary btn-sm"
                style="padding: 1px;"
                onclick="
                    GFFOBJ.changecolorstable('`+i+`');
                "
            >
                <i class="fa fa-paint-brush fa-lg"></i>
            </a>`;
            txtcol += `</td>`;
            txtcol += `</tr>`;
        }
        txtcol += "</tbody>"
        txtcol += "</table>";
        gelem("idwinmodalcolorbody").innerHTML = txtcol;
        
        for(var i in CCTT.COLORST){
            idt = `tcoloridx`+i+``;
            CCTT.id = i;
            c = self.interpolate();
            self.drawcolorpalette("#"+idt, w, h, c);
        }
    
    };

    this.drawcolorpalette = function(idview, w, h, cf){
        var n = 100;
        var data = Array.from(Array(n).keys());
        var xScale = d3.scaleLinear()
            .domain([0,n-1])
            .range([0, w]);
    
        d3.select(idview).selectAll("svg").remove();
        var svgmain = d3.select(idview).append("svg")
            .attr("width", w)
            .attr("height", h)
            .on("click",    function() {
                //console.log(coords);    
            })
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .append("g");
        
        var palette = svgmain.append("g").selectAll(".rectclass");
        
        palette = palette.data(data);
        palette.exit().remove();
        
        palette = palette.enter().append("rect")
            .attr("class", "rectclass")
            .attr("x", (d) => Math.floor(xScale(d)))
            .attr("y", 0)
            .attr("height", h)
            .attr("width", (d) => {
                // if (d == n-1) {
                //     return 6;
                // }
                return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
            })
            .attr("fill", (d) => cf(d/(n-1)) );
    };

    this.main =  function() {
        var win =
        `
        <div id="idwinmodalcolor" 
            style="
                position: fixed;
                top: 50%;
                left: 50%;
                margin: 0 auto;        
                width: 600px;
                height: 300px;
                background-color:#e6e6e6;
                border: 1px solid #999;
                margin-top: -150px;
                margin-left: -300px;
                z-index: 10;
                display: none;

            "
        >
            <table style="width: 100%; height: 100%;">
                <tr>
                    <td style="vertical-align: middle; border-bottom: solid 1px #999;
                        height: 25px;
                    ">
                        <table style="width: 100%;">
                            <tr>
                                <td style="vertical-align: middle;">
                                    <div 
                                        id="idwinmodalcolortitle"
                                        style="
                                            width: 100%;
                                            margin-left: 4px;
                                            text-align: left;
                                            vertical-align: middle;
                                        "
                                    >
                                    </div>                                    
                                </td>
                                <td style="vertical-align: middle;">
                                    <div 
                                        style="
                                            margin-right: 4px;
                                            cursor: pointer;
                                            text-align: right;
                                        "
                                        onclick="
                                            gelem('idwinmodalcolor').style.display = 'none';
                                        "
                                        title="Close"
                                    >
                                        <i class="fa fa-times" style="font-size: 16px;" aria-hidden="true"></i>
                                    </div>                                
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="height: 240px; vertical-align: top;">
                        <div id="idwinmodalcolorbody" style="overflow: auto; max-height: 240px;"></div>
                    </td>
                </tr>
                <tr>
                    <td style="border-top: solid 1px #999; vertical-align: middle; padding: 3px;
                    text-align: center;
                    ">
                        <button type="button"
                            class="btn btn-primary btn-sm"
                            style="max-width: 70px; min-width: 70px"
                            onclick="
                            gelem('idwinmodalcolor').style.display = 'none';
                            "
                        >
                            Close
                        </button>
                    </td>
                </tr>
            </table>
        </div>`;

        var container = document.createElement("DIV");       
        container.id = "ColorPaletteIdx45";
        container.innerHTML = win;
        //console.log("container",container);
        document.body.appendChild(container);
    };
    //self.init();
}
let CCTT = new ColorPalette();

