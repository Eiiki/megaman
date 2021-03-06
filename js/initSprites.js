function initSprites() {
    //Sprite(image, sourceX, sourceY, width, height)
    g_sprites.megaman_still = new Sprite(
        g_images.megaman_sprite,
        103,10,
        21,24
    );
    g_sprites.megaman_jump = new Sprite(
        g_images.megaman_sprite,
        265,4,
        26,30
    );
    g_sprites.megaman_dead = new Sprite(
        g_images.megaman_sprite,
        184,94,
        32,14
    );
    g_sprites.megaman_invulnerable = new Sprite(
        g_images.megaman_sprite,
        280, 45,
        30, 30
    );
    g_sprites.megaman_explosion = new Sprite(
        g_images.megaman_sprite,
        272, 275,
        50, 55
    );
    g_sprites.megaman_running = [
        new Sprite(
            g_images.megaman_sprite,
            188,12,
            24,22
        ),
        new Sprite(
            g_images.megaman_sprite,
            218,10,
            16,24
        ),
        new Sprite(
            g_images.megaman_sprite,
            239,12,
            21,22
        ),
        new Sprite(
            g_images.megaman_sprite,
            218,10,
            16,24
        )

    ];
    
    g_sprites.megaman_climbing = [
        new Sprite(
            g_images.megaman_sprite,
            61,245,
            20,32
        ),
        new Sprite(
            g_images.megaman_sprite,
            84,245,
            20,32
        )
    ];

    g_sprites.misteryBox = [
        new Sprite(
            g_images.mistery_box,
            0,0,
            17,14
        ),
        new Sprite(
            g_images.mistery_box,
            17,0,
            17,14
        )
    ];

    g_sprites.megaman_fire = {
        still : new Sprite(
            g_images.megaman_sprite,
            4,45,
            41,26
        ),
        running : [
            new Sprite(
                g_images.megaman_sprite,
                50,48,
                29,22
            ),
            new Sprite(
                g_images.megaman_sprite,
                84,46,
                26,24
            ),
            new Sprite(
                g_images.megaman_sprite,
                113,48,
                30,22
            ),
            new Sprite(
                g_images.megaman_sprite,
                84,46,
                26,24
            )
        ],
        jumping : new Sprite(
            g_images.megaman_sprite,
            146, 40,
            29,30
        )
    };

    // ==========
    // AI sprites
    // ==========
     g_sprites.snakeman = {
        walking : [
            new Sprite(
                g_images.snakeman,
                185, 25,
                37, 30
            ),
            new Sprite(
                g_images.snakeman,
                135, 25,
                37, 30
            ),
            new Sprite(
                g_images.snakeman,
                90,  25,
                37, 30
            ),
            new Sprite(
                g_images.snakeman,
                45,  25,
                37, 30
            )
        ],
        jumping : [
            new Sprite(
                g_images.snakeman,
                355, 15,
                24, 45
            )
        ],
        highjumping : [
            new Sprite(
                g_images.snakeman,
                355, 15,
                25, 45
            ),
            new Sprite(
                g_images.snakeman,
                310, 20,
                40, 35
            ),
            new Sprite(
                g_images.snakeman,
                275, 20,
                30, 35
            )
        ],
        cinematic : [
            new Sprite(
                g_images.snakeman,
                0,   25,
                37, 30
            ),
            new Sprite(
                g_images.snakeman,
                225, 25,
                37, 30
            )
        ],
        explosion : new Sprite(
            g_images.megaman_sprite,
            272, 287,
            50, 33,
            3
        ),
        bullets : [
            new Sprite(
                g_images.snakebullets,
                0, 0,
                19, 8
            ),
            new Sprite(
                g_images.snakebullets,
                19, 0,
                19, 8
            )
        ]
    };
    g_sprites.dada_moving = [
        new Sprite(
            g_images.dada,
            0, 0,
            85, 92
        ),
        new Sprite(
            g_images.dada,
            90, 0,
            85, 92
        ),
        new Sprite(
            g_images.dada,
            175, 0,
            85, 92
        ),
        new Sprite(
            g_images.dada,
            265, 0,
            85, 92
        )
    ];

    g_sprites.petiteSnakey = [
        new Sprite(
            g_images.petiteSnakey,
            0, 0,
            30, 25, 2
        ),
        new Sprite(
            g_images.petiteSnakey,
            32, 0,
            30, 25, 2
        ),
        new Sprite(
            g_images.petiteSnakey,
            64, 0,
            30, 25, 2
        )
    ];

    g_sprites.bigSnakey = [
        new Sprite(
            g_images.bigSnakey,
            0, 0,
            74, 54,
            2.1
        ),
        new Sprite(
            g_images.bigSnakey,
            74,0,
            74,54,
            2.1
        ),
        new Sprite(
            g_images.bigSnakey,
            147,0,
            76,54,
            2.1
        ),
    ];

    g_sprites.big_bullet = [
        new Sprite(
            g_images.big_bullet,
            0, 0,
            16, 14
        ),
        new Sprite(
            g_images.big_bullet,
            16, 0,
            16, 14
        ),
        new Sprite(
            g_images.big_bullet,
            32, 0,
            16, 14
        ),
        new Sprite(
            g_images.big_bullet,
            48, 0,
            16, 14
        ),
        new Sprite(
            g_images.big_bullet,
            64, 0,
            16, 14
        )
    ];

    g_sprites.potton_copter = [
        new Sprite(
            g_images.potton_copter,
            -1, 0,
            23, 20
        ),
        new Sprite(
            g_images.potton_copter,
            23, 0,
            25, 20
        )
    ];
    g_sprites.potton_ball = [
        new Sprite(
            g_images.potton_ball,
            0, 0,
            20, 25
        ),
        new Sprite(
            g_images.potton_ball,
            22, 0,
            25, 25
        )
    ];    

    g_sprites.bubukan = {
        walking : [
            new Sprite(
                g_images.bubukan,
                0, 6,
                50, 33
            ),
            new Sprite(
                g_images.bubukan,
                50, 6,
                50, 33
            )
        ],
        jumping : [
            new Sprite(
                g_images.bubukan,
                100, 0,
                45, 45
            ),
            new Sprite(
                g_images.bubukan,
                146, 0,
                50, 45
            )
        ],
        falling : [
            new Sprite(
                g_images.bubukan,
                232, 0,
                45, 45
            ),
            new Sprite(
                g_images.bubukan,
                278, 0,
                45, 45
            ),
            new Sprite(
                g_images.bubukan,
                323, 0,
                45, 45
            ),
            new Sprite(
                g_images.bubukan,
                372, 0,
                45, 45 
            )
        ],
        stick : new Sprite(
            g_images.bubukan,
            200, 0,
            30, 45       
        )
    };

    g_sprites.jamacy = [
        new Sprite(
            g_images.jamacy,
            0, 0,
            19, 17
        ),
        new Sprite(
            g_images.jamacy,
            19, 0,
            19, 17
        )
    ];

    g_sprites.explosion = [
        new Sprite(
            g_images.explosion,
            0, 0,
            16, 16
        ),
        new Sprite(
            g_images.explosion,
            16, 0,
            16, 16
        ),
        new Sprite(
            g_images.explosion,
            32, 0,
            16, 16
        ),
        new Sprite(
            g_images.explosion,
            48, 0,
            16, 16
        )
    ];

    g_sprites.small_pill = [
        new Sprite(
            g_images.small_pill,
            1, 0,
            12, 10
        ),
        new Sprite(
            g_images.small_pill,
            13, 0,
            12, 10
        )
    ];

    g_sprites.big_life = [
        new Sprite(
            g_images.big_life,
            0, 0,
            14, 14
        ),
        new Sprite(
            g_images.big_life,
            15, 0,
            14, 14
        )
    ];

    g_sprites.hammer_joe = [
        new Sprite(
            g_images.hammer_joe,
            0, 21,
            45, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            50, 21,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            92, 21,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            128.5, 21,
            55, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            0, 21,
            45, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            50, 21,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            92, 21,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            128.5, 21,
            55, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            0, 21,
            45, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            50, 21,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            92, 21,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            128.5, 21,
            55, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            0, 70,
            45, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            50, 70,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            92, 70,
            35, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            128.5, 70,
            55, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            0, 70,
            45, 43, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            186, 68.5,
            35, 44, 2
        )
    ];

    g_sprites.hammer_joe_bullet = [
        new Sprite(
            g_images.hammer_joe,
            0, 3,
            23, 14, 2
        ),
        new Sprite(
            g_images.hammer_joe,
            27, 3,
            23, 14, 2
        ),          
    ];

    g_sprites.small_life = [
        new Sprite(
            g_images.small_life,
            0, 0,
            10, 10
        ),
        new Sprite(
            g_images.small_life,
            11, 0,
            10, 10
        )
    ];

    g_sprites.bomb_flier = [
        new Sprite(
            g_images.bomb_flier,
            0, 34,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            39, 34,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            78, 34,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            117, 34,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            156, 34,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            156, 0,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            117, 0,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            0, 0,
            39, 34
        ),
        new Sprite(
            g_images.bomb_flier,
            39, 0,
            39, 34
        )
        ,
        new Sprite(
            g_images.bomb_flier,
            78, 0,
            39, 34
        )
    ];

    g_sprites.snake_part = new Sprite(
        g_images.snake_part,
        0,0,
        g_images.snake_part.width, g_images.snake_part.height,
        2
    );

    g_sprites.megaman_health = new Sprite(
        g_images.megaman_health
    );

    g_sprites.snakeman_health = new Sprite(
        g_images.snakeman_health,
        0, 0,
        27, 181,
        0.615
    );

    g_sprites.gate = new Sprite(
        g_images.gate,
        0, 0,
        56, 193,
        0.68
    );

    g_sprites.map = new Sprite(
        g_images.map
    );

    g_sprites.bullet = new Sprite(
        g_images.bullet_sprite
    );

    g_sprites.titleScreen = [
        new Sprite(
            g_images.map,
            14, 14,
            260, 244,
            1.98
        ),
        new Sprite(
            g_images.map,
            274, 14,
            260, 244,
            1.98
        )
    ];

    g_sprites.youWin = new Sprite(
        g_images.youWin,
        0, 0,
        290, 272,
        1.8
    );

    g_sprites.cloud = [
        new Sprite(
            g_images.cloud,
            0, 0,
            36, 25, 2
        ),
        new Sprite(
            g_images.cloud,
            36, 0,
            36, 25, 2
        )
    ];
}