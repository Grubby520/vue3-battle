import Mock from 'mockjs'
function similar (options) {
  if (options.body === 'category') {
    return [
      {
        'id': 6,
        'name': '规格',
        'code': 'NZ012',
        'extendCode': 'NZ012',
        'image': true,
        'custom': false,
        'usable': true,
        'required': true,
        'checkbox': true,
        'system': [
          {
            'name': 'ERP',
            'value': 1
          },
          {
            'name': 'SRM',
            'value': 2
          }
        ],
        'type': {
          'name': '销售属性',
          'value': 3
        },
        'saleAttributeType': {
          'name': '规格',
          'value': 3
        },
        'termValueType': {
          'name': '标准化文本',
          'value': 1
        },
        'terms': [
          {
            'id': 1190,
            'name': '爸爸',
            'code': '1190',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1191,
            'name': '妈妈',
            'code': '1191',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1192,
            'name': '婴儿',
            'code': '1192',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1195,
            'name': '大',
            'code': '1195',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1231,
            'name': '常规',
            'code': '1231',
            'usable': true,
            'deleted': false
          }
        ],
        'mainAttribute': true,
        'relatedSizes': [
          {
            'termId': 1190,
            'termName': '爸爸',
            'relatedSizeId': 57,
            'relatedSizeName': '童装尺码'
          },
          {
            'termId': 1191,
            'termName': '妈妈',
            'relatedSizeId': 58,
            'relatedSizeName': '标码尺码'
          },
          {
            'termId': 1192,
            'termName': '婴儿',
            'relatedSizeId': 216,
            'relatedSizeName': '婴儿尺码'
          }
        ]
      },
      {
        'id': 216,
        'name': '婴儿尺码',
        'code': 'NZ011',
        'extendCode': 'NZ011',
        'image': true,
        'custom': false,
        'usable': true,
        'required': true,
        'checkbox': true,
        'system': [
          {
            'name': 'ERP',
            'value': 1
          },
          {
            'name': 'SRM',
            'value': 2
          }
        ],
        'type': {
          'name': '销售属性',
          'value': 3
        },
        'saleAttributeType': {
          'name': '尺码',
          'value': 2
        },
        'termValueType': {
          'name': '标准化文本',
          'value': 1
        },
        'terms': [
          {
            'id': 13,
            'name': 'XXS',
            'code': '13',
            'usable': true,
            'deleted': false
          },
          {
            'id': 14,
            'name': 'XS',
            'code': '14',
            'usable': true,
            'deleted': false
          },
          {
            'id': 15,
            'name': 'S111',
            'code': '15',
            'usable': true,
            'deleted': false
          },
          {
            'id': 16,
            'name': 'M',
            'code': '16',
            'usable': true,
            'deleted': false
          },
          {
            'id': 17,
            'name': 'L',
            'code': '17',
            'usable': true,
            'deleted': false
          },
          {
            'id': 19,
            'name': 'XXL',
            'code': '19',
            'usable': true,
            'deleted': false
          },
          {
            'id': 20,
            'name': 'XXXL',
            'code': '20',
            'usable': true,
            'deleted': false
          },
          {
            'id': 21,
            'name': 'XXXXL',
            'code': '21',
            'usable': true,
            'deleted': false
          },
          {
            'id': 22,
            'name': 'XXXXXL',
            'code': '22',
            'usable': true,
            'deleted': false
          },
          {
            'id': 23,
            'name': '0XL',
            'code': '23',
            'usable': true,
            'deleted': false
          },
          {
            'id': 24,
            'name': '1XL',
            'code': '24',
            'usable': true,
            'deleted': false
          },
          {
            'id': 25,
            'name': '2XL',
            'code': '25',
            'usable': true,
            'deleted': false
          },
          {
            'id': 26,
            'name': '3XL',
            'code': '26',
            'usable': true,
            'deleted': false
          },
          {
            'id': 27,
            'name': '4XL',
            'code': '27',
            'usable': true,
            'deleted': false
          },
          {
            'id': 28,
            'name': '5XL',
            'code': '28',
            'usable': true,
            'deleted': false
          },
          {
            'id': 29,
            'name': '6XL',
            'code': '29',
            'usable': true,
            'deleted': false
          },
          {
            'id': 575,
            'name': '34',
            'code': '575',
            'usable': true,
            'deleted': false
          },
          {
            'id': 576,
            'name': '35',
            'code': '576',
            'usable': true,
            'deleted': false
          },
          {
            'id': 577,
            'name': '36',
            'code': '577',
            'usable': true,
            'deleted': false
          },
          {
            'id': 578,
            'name': '37',
            'code': '578',
            'usable': true,
            'deleted': false
          },
          {
            'id': 579,
            'name': '38',
            'code': '579',
            'usable': true,
            'deleted': false
          },
          {
            'id': 580,
            'name': '39',
            'code': '580',
            'usable': true,
            'deleted': false
          },
          {
            'id': 581,
            'name': '40',
            'code': '581',
            'usable': true,
            'deleted': false
          },
          {
            'id': 582,
            'name': '41',
            'code': '582',
            'usable': true,
            'deleted': false
          },
          {
            'id': 583,
            'name': '42',
            'code': '583',
            'usable': true,
            'deleted': false
          },
          {
            'id': 584,
            'name': '43',
            'code': '584',
            'usable': true,
            'deleted': false
          },
          {
            'id': 585,
            'name': '44',
            'code': '585',
            'usable': true,
            'deleted': false
          },
          {
            'id': 586,
            'name': '45',
            'code': '586',
            'usable': true,
            'deleted': false
          },
          {
            'id': 587,
            'name': '46',
            'code': '587',
            'usable': true,
            'deleted': false
          },
          {
            'id': 588,
            'name': '47',
            'code': '588',
            'usable': true,
            'deleted': false
          },
          {
            'id': 589,
            'name': '0-3M',
            'code': '589',
            'usable': true,
            'deleted': false
          },
          {
            'id': 590,
            'name': '3-6M',
            'code': '590',
            'usable': true,
            'deleted': false
          },
          {
            'id': 591,
            'name': '6-9M',
            'code': '591',
            'usable': true,
            'deleted': false
          },
          {
            'id': 592,
            'name': '9-12M',
            'code': '592',
            'usable': true,
            'deleted': false
          },
          {
            'id': 593,
            'name': '12-18M',
            'code': '593',
            'usable': true,
            'deleted': false
          },
          {
            'id': 594,
            'name': '18-24M',
            'code': '594',
            'usable': true,
            'deleted': false
          },
          {
            'id': 595,
            'name': '3T',
            'code': '595',
            'usable': true,
            'deleted': false
          },
          {
            'id': 596,
            'name': '4T',
            'code': '596',
            'usable': true,
            'deleted': false
          },
          {
            'id': 597,
            'name': '5T',
            'code': '597',
            'usable': true,
            'deleted': false
          },
          {
            'id': 598,
            'name': '6T',
            'code': '598',
            'usable': true,
            'deleted': false
          },
          {
            'id': 599,
            'name': '7T',
            'code': '599',
            'usable': true,
            'deleted': false
          },
          {
            'id': 600,
            'name': '8T',
            'code': '600',
            'usable': true,
            'deleted': false
          },
          {
            'id': 601,
            'name': '9T',
            'code': '601',
            'usable': true,
            'deleted': false
          },
          {
            'id': 602,
            'name': '10T',
            'code': '602',
            'usable': true,
            'deleted': false
          },
          {
            'id': 603,
            'name': '11T',
            'code': '603',
            'usable': true,
            'deleted': false
          },
          {
            'id': 604,
            'name': '12T',
            'code': '604',
            'usable': true,
            'deleted': false
          },
          {
            'id': 605,
            'name': '13T',
            'code': '605',
            'usable': true,
            'deleted': false
          },
          {
            'id': 606,
            'name': '14T',
            'code': '606',
            'usable': true,
            'deleted': false
          },
          {
            'id': 607,
            'name': '52',
            'code': '607',
            'usable': true,
            'deleted': false
          },
          {
            'id': 608,
            'name': '59',
            'code': '608',
            'usable': true,
            'deleted': false
          },
          {
            'id': 609,
            'name': '62',
            'code': '609',
            'usable': true,
            'deleted': false
          },
          {
            'id': 610,
            'name': '66',
            'code': '610',
            'usable': true,
            'deleted': false
          },
          {
            'id': 611,
            'name': '68',
            'code': '611',
            'usable': true,
            'deleted': false
          },
          {
            'id': 612,
            'name': '70',
            'code': '612',
            'usable': true,
            'deleted': false
          },
          {
            'id': 613,
            'name': '73',
            'code': '613',
            'usable': true,
            'deleted': false
          },
          {
            'id': 614,
            'name': '74',
            'code': '614',
            'usable': true,
            'deleted': false
          },
          {
            'id': 615,
            'name': '80',
            'code': '615',
            'usable': true,
            'deleted': false
          },
          {
            'id': 616,
            'name': '86',
            'code': '616',
            'usable': true,
            'deleted': false
          },
          {
            'id': 617,
            'name': '90',
            'code': '617',
            'usable': true,
            'deleted': false
          },
          {
            'id': 618,
            'name': '92',
            'code': '618',
            'usable': true,
            'deleted': false
          },
          {
            'id': 619,
            'name': '100',
            'code': '619',
            'usable': true,
            'deleted': false
          },
          {
            'id': 620,
            'name': '110',
            'code': '620',
            'usable': true,
            'deleted': false
          },
          {
            'id': 621,
            'name': '120',
            'code': '621',
            'usable': true,
            'deleted': false
          },
          {
            'id': 622,
            'name': '130',
            'code': '622',
            'usable': true,
            'deleted': false
          },
          {
            'id': 624,
            'name': '150',
            'code': '624',
            'usable': true,
            'deleted': false
          },
          {
            'id': 625,
            'name': '160',
            'code': '625',
            'usable': true,
            'deleted': false
          },
          {
            'id': 626,
            'name': '170',
            'code': '626',
            'usable': true,
            'deleted': false
          },
          {
            'id': 627,
            'name': 'EU 3',
            'code': '627',
            'usable': true,
            'deleted': false
          },
          {
            'id': 628,
            'name': 'EU 5',
            'code': '628',
            'usable': true,
            'deleted': false
          },
          {
            'id': 629,
            'name': 'EU 7',
            'code': '629',
            'usable': true,
            'deleted': false
          },
          {
            'id': 630,
            'name': 'EU 9',
            'code': '630',
            'usable': true,
            'deleted': false
          },
          {
            'id': 631,
            'name': 'EU 11',
            'code': '631',
            'usable': true,
            'deleted': false
          },
          {
            'id': 632,
            'name': 'EU 13',
            'code': '632',
            'usable': true,
            'deleted': false
          },
          {
            'id': 634,
            'name': '妈妈：S',
            'code': '634',
            'usable': true,
            'deleted': false
          },
          {
            'id': 635,
            'name': '妈妈：M',
            'code': '635',
            'usable': true,
            'deleted': false
          },
          {
            'id': 636,
            'name': '妈妈：L',
            'code': '636',
            'usable': true,
            'deleted': false
          },
          {
            'id': 637,
            'name': '妈妈：XL',
            'code': '637',
            'usable': true,
            'deleted': false
          },
          {
            'id': 638,
            'name': '妈妈：XXL',
            'code': '638',
            'usable': true,
            'deleted': false
          },
          {
            'id': 639,
            'name': '爸爸：M',
            'code': '639',
            'usable': true,
            'deleted': false
          },
          {
            'id': 640,
            'name': '爸爸：L',
            'code': '640',
            'usable': true,
            'deleted': false
          },
          {
            'id': 641,
            'name': '爸爸：XL',
            'code': '641',
            'usable': true,
            'deleted': false
          },
          {
            'id': 642,
            'name': '爸爸：XXL',
            'code': '642',
            'usable': true,
            'deleted': false
          },
          {
            'id': 643,
            'name': '爸爸：XXXL',
            'code': '643',
            'usable': true,
            'deleted': false
          },
          {
            'id': 644,
            'name': '婴儿：0-3M',
            'code': '644',
            'usable': true,
            'deleted': false
          },
          {
            'id': 645,
            'name': '婴儿：3-6M',
            'code': '645',
            'usable': true,
            'deleted': false
          },
          {
            'id': 646,
            'name': '婴儿：6-9M',
            'code': '646',
            'usable': true,
            'deleted': false
          },
          {
            'id': 647,
            'name': '婴儿：9-12M',
            'code': '647',
            'usable': true,
            'deleted': false
          },
          {
            'id': 648,
            'name': '婴儿：12-18M',
            'code': '648',
            'usable': true,
            'deleted': false
          },
          {
            'id': 649,
            'name': '婴儿：18-24M',
            'code': '649',
            'usable': true,
            'deleted': false
          },
          {
            'id': 650,
            'name': '婴儿：59',
            'code': '650',
            'usable': true,
            'deleted': false
          },
          {
            'id': 651,
            'name': '婴儿：52',
            'code': '651',
            'usable': true,
            'deleted': false
          },
          {
            'id': 652,
            'name': '婴儿：60',
            'code': '652',
            'usable': true,
            'deleted': false
          },
          {
            'id': 653,
            'name': '婴儿：62',
            'code': '653',
            'usable': true,
            'deleted': false
          },
          {
            'id': 654,
            'name': '婴儿：66',
            'code': '654',
            'usable': true,
            'deleted': false
          },
          {
            'id': 655,
            'name': '婴儿：68',
            'code': '655',
            'usable': true,
            'deleted': false
          },
          {
            'id': 656,
            'name': '婴儿：70',
            'code': '656',
            'usable': true,
            'deleted': false
          },
          {
            'id': 657,
            'name': '婴儿：73',
            'code': '657',
            'usable': true,
            'deleted': false
          },
          {
            'id': 658,
            'name': '婴儿：74',
            'code': '658',
            'usable': true,
            'deleted': false
          },
          {
            'id': 659,
            'name': '婴儿：80',
            'code': '659',
            'usable': true,
            'deleted': false
          },
          {
            'id': 660,
            'name': '婴儿：86',
            'code': '660',
            'usable': true,
            'deleted': false
          },
          {
            'id': 661,
            'name': '婴儿：90',
            'code': '661',
            'usable': true,
            'deleted': false
          },
          {
            'id': 662,
            'name': '婴儿：92',
            'code': '662',
            'usable': true,
            'deleted': false
          },
          {
            'id': 663,
            'name': '婴儿：100',
            'code': '663',
            'usable': true,
            'deleted': false
          },
          {
            'id': 664,
            'name': '婴儿：110',
            'code': '664',
            'usable': true,
            'deleted': false
          },
          {
            'id': 665,
            'name': '女童：1T',
            'code': '665',
            'usable': true,
            'deleted': false
          },
          {
            'id': 666,
            'name': '女童：2T',
            'code': '666',
            'usable': true,
            'deleted': false
          },
          {
            'id': 667,
            'name': '女童：3T',
            'code': '667',
            'usable': true,
            'deleted': false
          },
          {
            'id': 668,
            'name': '女童：4T',
            'code': '668',
            'usable': true,
            'deleted': false
          },
          {
            'id': 669,
            'name': '女童：5T',
            'code': '669',
            'usable': true,
            'deleted': false
          },
          {
            'id': 670,
            'name': '女童：6T',
            'code': '670',
            'usable': true,
            'deleted': false
          },
          {
            'id': 671,
            'name': '女童：7T',
            'code': '671',
            'usable': true,
            'deleted': false
          },
          {
            'id': 672,
            'name': '女童：8T',
            'code': '672',
            'usable': true,
            'deleted': false
          },
          {
            'id': 673,
            'name': '女童：9T',
            'code': '673',
            'usable': true,
            'deleted': false
          },
          {
            'id': 674,
            'name': '女童：10T',
            'code': '674',
            'usable': true,
            'deleted': false
          },
          {
            'id': 675,
            'name': '女童：11T',
            'code': '675',
            'usable': true,
            'deleted': false
          },
          {
            'id': 676,
            'name': '女童：12T',
            'code': '676',
            'usable': true,
            'deleted': false
          },
          {
            'id': 677,
            'name': '女童：13T',
            'code': '677',
            'usable': true,
            'deleted': false
          },
          {
            'id': 678,
            'name': '女童：14T',
            'code': '678',
            'usable': true,
            'deleted': false
          },
          {
            'id': 679,
            'name': '女童：80',
            'code': '679',
            'usable': true,
            'deleted': false
          },
          {
            'id': 680,
            'name': '女童：90',
            'code': '680',
            'usable': true,
            'deleted': false
          },
          {
            'id': 681,
            'name': '女童：100',
            'code': '681',
            'usable': true,
            'deleted': false
          },
          {
            'id': 682,
            'name': '女童：110',
            'code': '682',
            'usable': true,
            'deleted': false
          },
          {
            'id': 683,
            'name': '女童：120',
            'code': '683',
            'usable': true,
            'deleted': false
          },
          {
            'id': 684,
            'name': '女童：130',
            'code': '684',
            'usable': true,
            'deleted': false
          },
          {
            'id': 685,
            'name': '女童：140',
            'code': '685',
            'usable': true,
            'deleted': false
          },
          {
            'id': 686,
            'name': '女童：150',
            'code': '686',
            'usable': true,
            'deleted': false
          },
          {
            'id': 687,
            'name': '女童：160',
            'code': '687',
            'usable': true,
            'deleted': false
          },
          {
            'id': 688,
            'name': '女童：170',
            'code': '688',
            'usable': true,
            'deleted': false
          },
          {
            'id': 689,
            'name': '男童：1T',
            'code': '689',
            'usable': true,
            'deleted': false
          },
          {
            'id': 690,
            'name': '男童：2T',
            'code': '690',
            'usable': true,
            'deleted': false
          },
          {
            'id': 691,
            'name': '男童：3T',
            'code': '691',
            'usable': true,
            'deleted': false
          },
          {
            'id': 692,
            'name': '男童：4T',
            'code': '692',
            'usable': true,
            'deleted': false
          },
          {
            'id': 693,
            'name': '男童：5T',
            'code': '693',
            'usable': true,
            'deleted': false
          },
          {
            'id': 694,
            'name': '男童：6T',
            'code': '694',
            'usable': true,
            'deleted': false
          },
          {
            'id': 695,
            'name': '男童：7T',
            'code': '695',
            'usable': true,
            'deleted': false
          },
          {
            'id': 696,
            'name': '男童：8T',
            'code': '696',
            'usable': true,
            'deleted': false
          },
          {
            'id': 697,
            'name': '男童：9T',
            'code': '697',
            'usable': true,
            'deleted': false
          },
          {
            'id': 698,
            'name': '男童：10T',
            'code': '698',
            'usable': true,
            'deleted': false
          },
          {
            'id': 699,
            'name': '男童：11T',
            'code': '699',
            'usable': true,
            'deleted': false
          },
          {
            'id': 700,
            'name': '男童：12T',
            'code': '700',
            'usable': true,
            'deleted': false
          },
          {
            'id': 701,
            'name': '男童：13T',
            'code': '701',
            'usable': true,
            'deleted': false
          },
          {
            'id': 702,
            'name': '男童：14T',
            'code': '702',
            'usable': true,
            'deleted': false
          },
          {
            'id': 703,
            'name': '男童：80',
            'code': '703',
            'usable': true,
            'deleted': false
          },
          {
            'id': 704,
            'name': '男童：90',
            'code': '704',
            'usable': true,
            'deleted': false
          },
          {
            'id': 705,
            'name': '男童：100',
            'code': '705',
            'usable': true,
            'deleted': false
          },
          {
            'id': 706,
            'name': '男童：110',
            'code': '706',
            'usable': true,
            'deleted': false
          },
          {
            'id': 707,
            'name': '男童：120',
            'code': '707',
            'usable': true,
            'deleted': false
          },
          {
            'id': 708,
            'name': '男童：130',
            'code': '708',
            'usable': true,
            'deleted': false
          },
          {
            'id': 709,
            'name': '男童：140',
            'code': '709',
            'usable': true,
            'deleted': false
          },
          {
            'id': 710,
            'name': '男童：150',
            'code': '710',
            'usable': true,
            'deleted': false
          },
          {
            'id': 711,
            'name': '男童：160',
            'code': '711',
            'usable': true,
            'deleted': false
          },
          {
            'id': 712,
            'name': '男童：170',
            'code': '712',
            'usable': true,
            'deleted': false
          },
          {
            'id': 723,
            'name': '28',
            'code': '723',
            'usable': true,
            'deleted': false
          },
          {
            'id': 724,
            'name': '29',
            'code': '724',
            'usable': true,
            'deleted': false
          },
          {
            'id': 725,
            'name': '30',
            'code': '725',
            'usable': true,
            'deleted': false
          },
          {
            'id': 726,
            'name': '31',
            'code': '726',
            'usable': true,
            'deleted': false
          },
          {
            'id': 727,
            'name': '32',
            'code': '727',
            'usable': true,
            'deleted': false
          },
          {
            'id': 728,
            'name': '33',
            'code': '728',
            'usable': true,
            'deleted': false
          },
          {
            'id': 729,
            'name': '26',
            'code': '729',
            'usable': true,
            'deleted': false
          },
          {
            'id': 730,
            'name': '27',
            'code': '730',
            'usable': true,
            'deleted': false
          },
          {
            'id': 731,
            'name': '24',
            'code': '731',
            'usable': true,
            'deleted': false
          },
          {
            'id': 732,
            'name': '25',
            'code': '732',
            'usable': true,
            'deleted': false
          },
          {
            'id': 740,
            'name': '70A',
            'code': '740',
            'usable': true,
            'deleted': false
          },
          {
            'id': 741,
            'name': '70B',
            'code': '741',
            'usable': true,
            'deleted': false
          },
          {
            'id': 742,
            'name': '70C',
            'code': '742',
            'usable': true,
            'deleted': false
          },
          {
            'id': 743,
            'name': '70D',
            'code': '743',
            'usable': true,
            'deleted': false
          },
          {
            'id': 744,
            'name': '70E',
            'code': '744',
            'usable': true,
            'deleted': false
          },
          {
            'id': 745,
            'name': '70F',
            'code': '745',
            'usable': true,
            'deleted': false
          },
          {
            'id': 746,
            'name': '75A',
            'code': '746',
            'usable': true,
            'deleted': false
          },
          {
            'id': 747,
            'name': '75B',
            'code': '747',
            'usable': true,
            'deleted': false
          },
          {
            'id': 748,
            'name': '75C',
            'code': '748',
            'usable': true,
            'deleted': false
          },
          {
            'id': 749,
            'name': '75D',
            'code': '749',
            'usable': true,
            'deleted': false
          },
          {
            'id': 750,
            'name': '75E',
            'code': '750',
            'usable': true,
            'deleted': false
          },
          {
            'id': 751,
            'name': '75F',
            'code': '751',
            'usable': true,
            'deleted': false
          },
          {
            'id': 752,
            'name': '80A',
            'code': '752',
            'usable': true,
            'deleted': false
          },
          {
            'id': 753,
            'name': '80B',
            'code': '753',
            'usable': true,
            'deleted': false
          },
          {
            'id': 754,
            'name': '80C',
            'code': '754',
            'usable': true,
            'deleted': false
          },
          {
            'id': 755,
            'name': '80D',
            'code': '755',
            'usable': true,
            'deleted': false
          },
          {
            'id': 756,
            'name': '80E',
            'code': '756',
            'usable': true,
            'deleted': false
          },
          {
            'id': 757,
            'name': '80F',
            'code': '757',
            'usable': true,
            'deleted': false
          },
          {
            'id': 758,
            'name': '85A',
            'code': '758',
            'usable': true,
            'deleted': false
          },
          {
            'id': 759,
            'name': '85B',
            'code': '759',
            'usable': true,
            'deleted': false
          },
          {
            'id': 760,
            'name': '85C',
            'code': '760',
            'usable': true,
            'deleted': false
          },
          {
            'id': 761,
            'name': '85D',
            'code': '761',
            'usable': true,
            'deleted': false
          },
          {
            'id': 762,
            'name': '85E',
            'code': '762',
            'usable': true,
            'deleted': false
          },
          {
            'id': 763,
            'name': '90A',
            'code': '763',
            'usable': true,
            'deleted': false
          },
          {
            'id': 764,
            'name': '90B',
            'code': '764',
            'usable': true,
            'deleted': false
          },
          {
            'id': 765,
            'name': '90C',
            'code': '765',
            'usable': true,
            'deleted': false
          },
          {
            'id': 766,
            'name': '90D',
            'code': '766',
            'usable': true,
            'deleted': false
          },
          {
            'id': 767,
            'name': '90E',
            'code': '767',
            'usable': true,
            'deleted': false
          },
          {
            'id': 768,
            'name': '90F',
            'code': '768',
            'usable': true,
            'deleted': false
          },
          {
            'id': 769,
            'name': '95B',
            'code': '769',
            'usable': true,
            'deleted': false
          },
          {
            'id': 770,
            'name': '95C',
            'code': '770',
            'usable': true,
            'deleted': false
          },
          {
            'id': 850,
            'name': '迷你',
            'code': '850',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1071,
            'name': '爸爸：S',
            'code': '1071',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1072,
            'name': '妈妈：XS',
            'code': '1072',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1086,
            'name': 'A',
            'code': '1086',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1087,
            'name': 'B',
            'code': '1087',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1088,
            'name': 'C',
            'code': '1088',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1089,
            'name': 'D',
            'code': '1089',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1090,
            'name': 'E',
            'code': '1090',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1091,
            'name': 'F',
            'code': '1091',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1092,
            'name': 'G',
            'code': '1092',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1093,
            'name': 'H',
            'code': '1093',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1094,
            'name': 'I',
            'code': '1094',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1095,
            'name': 'J',
            'code': '1095',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1164,
            'name': '100*190cm',
            'code': '1164',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1165,
            'name': '100*200cm',
            'code': '1165',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1166,
            'name': '120*200cm',
            'code': '1166',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1167,
            'name': '135*200cm',
            'code': '1167',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1168,
            'name': '140*190cm',
            'code': '1168',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1169,
            'name': '155*200cm',
            'code': '1169',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1170,
            'name': '160*220cm',
            'code': '1170',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1171,
            'name': '170*230cm',
            'code': '1171',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1172,
            'name': '180*200cm',
            'code': '1172',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1173,
            'name': '200*200cm',
            'code': '1173',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1174,
            'name': '200*230cm',
            'code': '1174',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1175,
            'name': '220*230cm',
            'code': '1175',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1176,
            'name': '220*240cm',
            'code': '1176',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1177,
            'name': '220*260cm',
            'code': '1177',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1178,
            'name': '230*230cm',
            'code': '1178',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1179,
            'name': '265*230cm',
            'code': '1179',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1180,
            'name': '30*50CM',
            'code': '1180',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1181,
            'name': '40*40CM',
            'code': '1181',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1182,
            'name': '40*60CM',
            'code': '1182',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1183,
            'name': '40*120CM',
            'code': '1183',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1184,
            'name': '45*45CM',
            'code': '1184',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1187,
            'name': '80*120CM',
            'code': '1187',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1218,
            'name': '&*&',
            'code': '1218',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1220,
            'name': '禁用属性值2',
            'code': '1220',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1221,
            'name': 'loydTest',
            'code': '1221',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1222,
            'name': '禁用属性值3',
            'code': '1222',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1223,
            'name': '禁用属性值测试333',
            'code': '1223',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1232,
            'name': 'lcl',
            'code': '1232',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1233,
            'name': 'sdfsdf',
            'code': '1233',
            'usable': true,
            'deleted': false
          }
        ],
        'deleted': false
      },
      {
        'id': 58,
        'name': '标码尺码',
        'code': '58',
        'extendCode': 'NZ011',
        'image': false,
        'custom': false,
        'usable': true,
        'required': true,
        'checkbox': true,
        'system': [
          {
            'name': 'ERP',
            'value': 1
          },
          {
            'name': 'SRM',
            'value': 2
          }
        ],
        'type': {
          'name': '销售属性',
          'value': 3
        },
        'saleAttributeType': {
          'name': '尺码',
          'value': 2
        },
        'termValueType': {
          'name': '标准化文本',
          'value': 1
        },
        'terms': [
          {
            'id': 13,
            'name': 'XXS',
            'code': '13',
            'usable': true,
            'deleted': false
          },
          {
            'id': 14,
            'name': 'XS',
            'code': '14',
            'usable': true,
            'deleted': false
          },
          {
            'id': 634,
            'name': '妈妈：S',
            'code': '634',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1071,
            'name': '爸爸：S',
            'code': '1071',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1072,
            'name': '妈妈：XS',
            'code': '1072',
            'usable': true,
            'deleted': false
          },
          {
            'id': 1221,
            'name': 'loydTest',
            'code': '1221',
            'usable': true,
            'deleted': false
          }
        ],
        'deleted': false
      },
      {
        'id': 57,
        'name': '童装尺码',
        'code': '57',
        'extendCode': 'NZ011',
        'image': false,
        'custom': false,
        'usable': true,
        'required': true,
        'checkbox': true,
        'system': [
          {
            'name': 'ERP',
            'value': 1
          },
          {
            'name': 'SRM',
            'value': 2
          }
        ],
        'type': {
          'name': '销售属性',
          'value': 3
        },
        'saleAttributeType': {
          'name': '尺码',
          'value': 2
        },
        'termValueType': {
          'name': '标准化文本',
          'value': 1
        },
        'terms': [
          {
            'id': 16,
            'name': 'M',
            'code': '16',
            'usable': true,
            'deleted': false
          },
          {
            'id': 17,
            'name': 'L',
            'code': '17',
            'usable': true,
            'deleted': false
          },
          {
            'id': 19,
            'name': 'XXL',
            'code': '19',
            'usable': true,
            'deleted': false
          },
          {
            'id': 589,
            'name': '0-3M',
            'code': '589',
            'usable': true,
            'deleted': false
          },
          {
            'id': 590,
            'name': '3-6M',
            'code': '590',
            'usable': true,
            'deleted': false
          },
          {
            'id': 591,
            'name': '6-9M',
            'code': '591',
            'usable': true,
            'deleted': false
          },
          {
            'id': 592,
            'name': '9-12M',
            'code': '592',
            'usable': true,
            'deleted': false
          },
          {
            'id': 593,
            'name': '12-18M',
            'code': '593',
            'usable': true,
            'deleted': false
          },
          {
            'id': 594,
            'name': '18-24M',
            'code': '594',
            'usable': true,
            'deleted': false
          },
          {
            'id': 595,
            'name': '3T',
            'code': '595',
            'usable': true,
            'deleted': false
          },
          {
            'id': 596,
            'name': '4T',
            'code': '596',
            'usable': true,
            'deleted': false
          },
          {
            'id': 597,
            'name': '5T',
            'code': '597',
            'usable': true,
            'deleted': false
          },
          {
            'id': 598,
            'name': '6T',
            'code': '598',
            'usable': true,
            'deleted': false
          },
          {
            'id': 599,
            'name': '7T',
            'code': '599',
            'usable': true,
            'deleted': false
          },
          {
            'id': 600,
            'name': '8T',
            'code': '600',
            'usable': true,
            'deleted': false
          },
          {
            'id': 601,
            'name': '9T',
            'code': '601',
            'usable': true,
            'deleted': false
          },
          {
            'id': 602,
            'name': '10T',
            'code': '602',
            'usable': true,
            'deleted': false
          },
          {
            'id': 603,
            'name': '11T',
            'code': '603',
            'usable': true,
            'deleted': false
          },
          {
            'id': 604,
            'name': '12T',
            'code': '604',
            'usable': true,
            'deleted': false
          },
          {
            'id': 605,
            'name': '13T',
            'code': '605',
            'usable': true,
            'deleted': false
          },
          {
            'id': 606,
            'name': '14T',
            'code': '606',
            'usable': true,
            'deleted': false
          },
          {
            'id': 607,
            'name': '52',
            'code': '607',
            'usable': true,
            'deleted': false
          },
          {
            'id': 608,
            'name': '59',
            'code': '608',
            'usable': true,
            'deleted': false
          },
          {
            'id': 609,
            'name': '62',
            'code': '609',
            'usable': true,
            'deleted': false
          },
          {
            'id': 610,
            'name': '66',
            'code': '610',
            'usable': true,
            'deleted': false
          },
          {
            'id': 611,
            'name': '68',
            'code': '611',
            'usable': true,
            'deleted': false
          },
          {
            'id': 612,
            'name': '70',
            'code': '612',
            'usable': true,
            'deleted': false
          },
          {
            'id': 613,
            'name': '73',
            'code': '613',
            'usable': true,
            'deleted': false
          },
          {
            'id': 614,
            'name': '74',
            'code': '614',
            'usable': true,
            'deleted': false
          },
          {
            'id': 615,
            'name': '80',
            'code': '615',
            'usable': true,
            'deleted': false
          },
          {
            'id': 616,
            'name': '86',
            'code': '616',
            'usable': true,
            'deleted': false
          },
          {
            'id': 617,
            'name': '90',
            'code': '617',
            'usable': true,
            'deleted': false
          },
          {
            'id': 618,
            'name': '92',
            'code': '618',
            'usable': true,
            'deleted': false
          },
          {
            'id': 619,
            'name': '100',
            'code': '619',
            'usable': true,
            'deleted': false
          },
          {
            'id': 620,
            'name': '110',
            'code': '620',
            'usable': true,
            'deleted': false
          },
          {
            'id': 621,
            'name': '120',
            'code': '621',
            'usable': true,
            'deleted': false
          },
          {
            'id': 622,
            'name': '130',
            'code': '622',
            'usable': true,
            'deleted': false
          },
          {
            'id': 624,
            'name': '150',
            'code': '624',
            'usable': true,
            'deleted': false
          },
          {
            'id': 625,
            'name': '160',
            'code': '625',
            'usable': true,
            'deleted': false
          },
          {
            'id': 626,
            'name': '170',
            'code': '626',
            'usable': true,
            'deleted': false
          },
          {
            'id': 627,
            'name': 'EU 3',
            'code': '627',
            'usable': true,
            'deleted': false
          },
          {
            'id': 628,
            'name': 'EU 5',
            'code': '628',
            'usable': true,
            'deleted': false
          },
          {
            'id': 629,
            'name': 'EU 7',
            'code': '629',
            'usable': true,
            'deleted': false
          },
          {
            'id': 630,
            'name': 'EU 9',
            'code': '630',
            'usable': true,
            'deleted': false
          },
          {
            'id': 631,
            'name': 'EU 11',
            'code': '631',
            'usable': true,
            'deleted': false
          },
          {
            'id': 632,
            'name': 'EU 13',
            'code': '632',
            'usable': true,
            'deleted': false
          }
        ],
        'deleted': false
      },
      {
        'id': 4,
        'name': '颜色',
        'code': 'NZ010',
        'extendCode': 'NZ010',
        'image': true,
        'custom': false,
        'usable': true,
        'required': true,
        'checkbox': true,
        'system': [
          {
            'name': 'ERP',
            'value': 1
          },
          {
            'name': 'SRM',
            'value': 2
          }
        ],
        'type': {
          'name': '销售属性',
          'value': 3
        },
        'saleAttributeType': {
          'name': '颜色',
          'value': 1
        },
        'termValueType': {
          'name': '标准化文本',
          'value': 1
        },
        'terms': [
          {
            'id': 419,
            'name': '黑色',
            'code': '419',
            'usable': false,
            'deleted': false
          },
          {
            'id': 422,
            'name': '白色',
            'code': '422',
            'usable': true,
            'deleted': false
          },
          {
            'id': 428,
            'name': '酒红色',
            'code': '428',
            'usable': true,
            'deleted': false
          },
          {
            'id': 434,
            'name': '军绿色',
            'code': '434',
            'usable': true,
            'deleted': false
          },
          {
            'id': 437,
            'name': '藏蓝色',
            'code': '437',
            'usable': true,
            'deleted': false
          },
          {
            'id': 440,
            'name': '粉色',
            'code': '440',
            'usable': true,
            'deleted': false
          },
          {
            'id': 442,
            'name': '红色',
            'code': '442',
            'usable': true,
            'deleted': false
          },
          {
            'id': 445,
            'name': '蓝色',
            'code': '445',
            'usable': true,
            'deleted': false
          },
          {
            'id': 449,
            'name': '绿色',
            'code': '449',
            'usable': true,
            'deleted': false
          },
          {
            'id': 451,
            'name': '麻灰色',
            'code': '451',
            'usable': true,
            'deleted': false
          },
          {
            'id': 452,
            'name': '黄色',
            'code': '452',
            'usable': true,
            'deleted': false
          },
          {
            'id': 454,
            'name': '紫色',
            'code': '454',
            'usable': true,
            'deleted': false
          },
          {
            'id': 457,
            'name': '银色',
            'code': '457',
            'usable': true,
            'deleted': false
          },
          {
            'id': 458,
            'name': '金黄',
            'code': '458',
            'usable': true,
            'deleted': false
          },
          {
            'id': 460,
            'name': '棕色',
            'code': '460',
            'usable': true,
            'deleted': false
          },
          {
            'id': 480,
            'name': '橘色',
            'code': '480',
            'usable': true,
            'deleted': false
          },
          {
            'id': 481,
            'name': '香槟色',
            'code': '481',
            'usable': true,
            'deleted': false
          },
          {
            'id': 483,
            'name': '米色',
            'code': '483',
            'usable': true,
            'deleted': false
          },
          {
            'id': 485,
            'name': '黄褐',
            'code': '485',
            'usable': true,
            'deleted': false
          },
          {
            'id': 487,
            'name': '咖啡',
            'code': '487',
            'usable': true,
            'deleted': false
          },
          {
            'id': 488,
            'name': '驼色',
            'code': '488',
            'usable': true,
            'deleted': false
          },
          {
            'id': 489,
            'name': '绿松石色',
            'code': '489',
            'usable': true,
            'deleted': false
          },
          {
            'id': 491,
            'name': '彩色',
            'code': '491',
            'usable': true,
            'deleted': false
          },
          {
            'id': 493,
            'name': '裸色',
            'code': '493',
            'usable': true,
            'deleted': false
          },
          {
            'id': 497,
            'name': '黑白色',
            'code': '497',
            'usable': true,
            'deleted': false
          },
          {
            'id': 501,
            'name': '杏色',
            'code': '501',
            'usable': true,
            'deleted': false
          },
          {
            'id': 503,
            'name': '渐变色',
            'code': '503',
            'usable': true,
            'deleted': false
          },
          {
            'id': 508,
            'name': '玫红色',
            'code': '508',
            'usable': true,
            'deleted': false
          },
          {
            'id': 510,
            'name': '紫红色',
            'code': '510',
            'usable': true,
            'deleted': false
          },
          {
            'id': 513,
            'name': '焦糖色',
            'code': '513',
            'usable': true,
            'deleted': false
          },
          {
            'id': 514,
            'name': '芥末黄',
            'code': '514',
            'usable': true,
            'deleted': false
          },
          {
            'id': 515,
            'name': '姜黄色',
            'code': '515',
            'usable': true,
            'deleted': false
          },
          {
            'id': 516,
            'name': '黄褐色',
            'code': '516',
            'usable': true,
            'deleted': false
          },
          {
            'id': 518,
            'name': '古铜色',
            'code': '518',
            'usable': true,
            'deleted': false
          },
          {
            'id': 519,
            'name': '明亮（可与其它亮色多选）',
            'code': '519',
            'usable': true,
            'deleted': false
          },
          {
            'id': 520,
            'name': '柔和（可与其它柔色多选）',
            'code': '520',
            'usable': true,
            'deleted': false
          },
          {
            'id': 733,
            'name': '复古蓝',
            'code': '733',
            'usable': true,
            'deleted': false
          },
          {
            'id': 734,
            'name': '复古绿',
            'code': '734',
            'usable': true,
            'deleted': false
          },
          {
            'id': 735,
            'name': '橄榄绿',
            'code': '735',
            'usable': true,
            'deleted': false
          },
          {
            'id': 736,
            'name': '玫瑰金',
            'code': '736',
            'usable': true,
            'deleted': false
          },
          {
            'id': 737,
            'name': '深水蓝',
            'code': '737',
            'usable': true,
            'deleted': false
          },
          {
            'id': 738,
            'name': '深灰色',
            'code': '738',
            'usable': true,
            'deleted': false
          },
          {
            'id': 739,
            'name': '浅灰色',
            'code': '739',
            'usable': true,
            'deleted': false
          },
          {
            'id': 899,
            'name': '枪色',
            'code': '899',
            'usable': false,
            'deleted': false
          }
        ],
        'deleted': false
      }
    ]
  } else if (options.body === 793) {
    return [
      {
        'productId': 135864,
        'imageId': 1673482,
        'similarity': 'B',
        'similarityValue': 5.2106351852417,
        'imageUrl': '//dev.starcdns.com/products/1619601522-fb789889-f907-43a0-b0b1-ad468073b91a.jpg',
        'code': 'RTRZ00614',
        'publishStatus': {
          'name': '可发布',
          'value': 20
        },
        'sourceType': {
          'name': '线上现货',
          'value': 1
        },
        'categoryId': 340,
        'categoryName': '任涛测试子节点-1',
        'choseByName': '任涛',
        'dataSource': 0,
        'createdAt': '2021-04-28 17:24:57'
      }
    ]
  }
}
Mock.mock('/mock/similar', 'post', similar)
