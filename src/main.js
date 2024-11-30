/*
Contributors: Kira Way
Project: Spider QWOP
*/

let config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 512,
    render: {
        //pixelArt:true,
    },
    physics:{
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [Play]
}

let game = new Phaser.Game(config);

//define keys
let key1, key2, key3, key4, key5, key6, key7, key8, key9, key0