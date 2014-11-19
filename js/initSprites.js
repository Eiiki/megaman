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
            73, 54,
            2.1
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

    g_sprites.snake_part = new Sprite(
        g_images.snake_part,
        0,0,
        g_images.snake_part.width, g_images.snake_part.height,
        2
    );

    g_sprites.megaman_health = new Sprite(
        g_images.megaman_health
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
}