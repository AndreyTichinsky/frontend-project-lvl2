export const correctDiff1to2 = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;
export const correctDiff2to1 = `{
    common: {
      - follow: false
        setting1: Value 1
      + setting2: 200
      - setting3: null
      + setting3: true
      - setting4: blah blah
      - setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: so much
              + wow: 
            }
            key: value
          - ops: vops
        }
    }
    group1: {
      - baz: bars
      + baz: bas
        foo: bar
      - nest: str
      + nest: {
            key: value
        }
    }
  + group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  - group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;
export const f1Diff = `{
    common: {
        setting1: Value 1
        setting2: 200
        setting3: true
        setting6: {
            doge: {
                wow: 
            }
            key: value
        }
    }
    group1: {
        baz: bas
        foo: bar
        nest: {
            key: value
        }
    }
    group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
}`;
