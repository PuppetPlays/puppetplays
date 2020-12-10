<?php

namespace craft\contentmigrations;

interface Formats {

    // Constants .............................................................................................
    const FORMATS_FR = [
        'audio',
        'vidéo',
        'manuscrit autographe',
        'manuscrit',
        'tapuscrit'
    ];
    
    const FORMATS_EN = [   
        'audio',
        'video',
        'autograph manuscript',
        'manuscript',
        'typescript'
    ];

    const FORMATS_IT = [       
        'Audio',
        'video',
        "manoscritto autografo",
        'manoscritto',
        'dattiloscritto'
    ];

    const FORMATS_GE = [
        'Audio',
        'Video',
        'Autogramm Manuskript',
        'Manuskript',
        'Typoskript'
    ];
}