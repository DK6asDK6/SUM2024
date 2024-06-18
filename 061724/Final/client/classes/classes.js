function countPB(level) {
  return Math.floor((level - 1) / 4) + 2;
}

export function countMastery(value) {
  return Math.floor(value / 2) - 5;
}

class _character {
  constructor(
    userName,
    name,
    statBlock,
    classes,
    abilities,
    hits,
    AC,
    equipment
  ) {
    this.name = name;
    this.userName = userName;
    this.personalName = this.userName + ":" + this.name;
    this.stat = {
      STR: statBlock[0],
      DEX: statBlock[1],
      CON: statBlock[2],
      INT: statBlock[3],
      WIS: statBlock[4],
      CHA: statBlock[5],
    };
    this.mastery = {
      STR: countMastery(this.STR),
      DEX: countMastery(this.DEX),
      CON: countMastery(this.CON),
      INT: countMastery(this.INT),
      WIS: countMastery(this.WIS),
      CHA: countMastery(this.CHA),
    };

    this.class = classes; // {clsassname, level}

    this.level = 0;

    for (_class of data.classes) this.level += _class.level;

    this.PB = countPB(this.level);

    this.race = data.race;

    this.abilities = {
      STR: {
        saveThrow: abilities.save[0],
        athletics: abilities.STR[0],
      },
      DEX: {
        saveThrow: abilities.save[1],
        acrobatics: abilities.DEX[0],
        sleightOfHand: abilities.DEX[1],
        stealth: abilities.DEX[2],
      },
      CON: {
        saveThrow: abilities.save[2],
      },
      INT: {
        saveThrow: abilities.save[3],
        arcana: abilities.INT[0],
        history: abilities.INT[1],
        investigation: abilities.INT[2],
        nature: abilities.INT[3],
        religion: abilities.INT[4],
      },
      WIS: {
        saveThrow: abilities.save[4],
        animalHandling: abilities.WIS[0],
        insight: abilities.WIS[1],
        medicine: abilities.WIS[2],
        perception: abilities.WIS[3],
        survival: abilities.WIS[4],
      },
      CHA: {
        saveThrow: abilities.save[5],
        deception: abilities.CHA[0],
        intimidation: abilities.CHA[1],
        performance: abilities.CHA[2],
        persuasion: abilities.CHA[3],
      },
    };

    this.bonuses = {
      STR: {
        passive: 10 + this.mastery.STR,
        athletics: this.mastery.STR + this.PB * this.abilities.STR.athletics,
        saveThrow: this.mastery.STR + this.PB * this.abilities.STR.saveThrow,
      },
      DEX: {
        passive: 10 + this.mastery.DEX,
        acrobatics: this.mastery.DEX + this.PB * this.abilities.DEX.acrobatics,
        sleightOfHand:
          this.mastery.DEX + this.PB * this.abilities.DEX.sleightOfHand,
        stealth: this.mastery.DEX + this.PB * this.abilities.DEX.stealth,
        saveThrow: this.mastery.DEX + this.PB * this.abilities.DEX.saveThrow,
      },
      CON: {
        passive: 10 + this.mastery.CON,
        saveThrow: this.mastery.CON + this.PB * this.abilities.CON.saveThrow,
      },
      INT: {
        passive: 10 + this.mastery.INT,
      },
    };

    this.hits = hits;
    this.AC = AC;
    this.equipment = equipment;
  }
}

export function character(data) {
  return new _character(data);
}

class _game {
  constructor(roomName, masterName) {
    this.roomName = roomName;
    this.masterName = masterName;
    this.personalName = masterName + ":" + roomName;
    this.users = [];
    this.viewers = [];
    this.characters = [];
    this.messages = [];
  }

  appendUser(userName) {
    if (
      userName != this.masterName &&
      !this.users.includes(userName) &&
      !this.viewers.includes(userName)
    )
      this.users.push(userName);
  }

  appendViewer(userName) {
    if (
      userName != this.masterName &&
      !this.users.includes(userName) &&
      !this.viewers.includes(userName)
    )
      this.viewers.push(userName);
  }

  appendCharacter(characterName) {
    if (
      characterName != this.masterName &&
      !this.characters.includes(characterName)
    )
      this.characters.push(userName);
  }

  appendMessage(message) {
    this.messages.push(message);
  }
}

export function game(roomName, masterName) {
  return new _game(roomName, masterName);
}

class _user {
  constructor(name, password) {
    this.name = name;
    this.password = password;
    this.characters = [];
    this.activeRooms = [];
  }

  appendCharacter(characterName) {
    if (!this.characters.includes(characterName))
      this.characters.push(characterName);
  }

  deleteCharacter(characterName) {
    if (this.characters.includes(characterName))
      this.characters.splice(this.characters.indexOf(characterName), 1);
  }
}

export function user(name, password) {
  return new _user(name, password);
}
