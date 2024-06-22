function countPersBonus(level) {
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
    race,
    abilities,
    hits,
    ArmorClass,
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
      STR: countMastery(this.stat.STR),
      DEX: countMastery(this.stat.DEX),
      CON: countMastery(this.stat.CON),
      INT: countMastery(this.stat.INT),
      WIS: countMastery(this.stat.WIS),
      CHA: countMastery(this.stat.CHA),
    };

    this.class = classes; // {clsassname, level}

    this.level = 0;

    for (let _class of this.class) this.level += _class.level;

    this.PersBonus = countPersBonus(this.level);

    this.race = race;

    console.log(abilities);
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
        athletics:
          this.mastery.STR + this.PersBonus * this.abilities.STR.athletics,
        saveThrow:
          this.mastery.STR + this.PersBonus * this.abilities.STR.saveThrow,
      },
      DEX: {
        passive: 10 + this.mastery.DEX,
        acrobatics:
          this.mastery.DEX + this.PersBonus * this.abilities.DEX.acrobatics,
        sleightOfHand:
          this.mastery.DEX + this.PersBonus * this.abilities.DEX.sleightOfHand,
        stealth: this.mastery.DEX + this.PersBonus * this.abilities.DEX.stealth,
        saveThrow:
          this.mastery.DEX + this.PersBonus * this.abilities.DEX.saveThrow,
      },
      CON: {
        passive: 10 + this.mastery.CON,
        saveThrow:
          this.mastery.CON + this.PersBonus * this.abilities.CON.saveThrow,
      },
      INT: {
        passive: 10 + this.mastery.INT,
        arcana: this.mastery.INT + this.PersBonus * this.abilities.INT.arcana,
        history: this.mastery.INT + this.PersBonus * this.abilities.INT.history,
        investigation:
          this.mastery.INT + this.PersBonus * this.abilities.INT.investigation,
        nature: this.mastery.INT + this.PersBonus * this.abilities.INT.nature,
        religion:
          this.mastery.INT + this.PersBonus * this.abilities.INT.religion,
      },
      WIS: {
        passive: 10 + this.mastery.WIS,
        animalHandling:
          this.mastery.WIS + this.PersBonus * this.abilities.WIS.animalHandling,
        insight: this.mastery.WIS + this.PersBonus * this.abilities.WIS.insight,
        medicine:
          this.mastery.WIS + this.PersBonus * this.abilities.WIS.medicine,
        perception:
          this.mastery.WIS + this.PersBonus * this.abilities.WIS.perception,
        survival:
          this.mastery.WIS + this.PersBonus * this.abilities.WIS.survival,
      },
      CHA: {
        deception:
          this.mastery.CHA + this.PersBonus * this.abilities.CHA.deception,
        intimidation:
          this.mastery.CHA + this.PersBonus * this.abilities.CHA.intimidation,
        performance:
          this.mastery.CHA + this.PersBonus * this.abilities.CHA.performance,
        persuasion:
          this.mastery.CHA + this.PersBonus * this.abilities.CHA.persuasion,
      },
    };

    this.hits = hits;
    this.ArmorClass = ArmorClass;
    this.equipment = equipment;
  }
}

export function character(
  userName,
  name,
  statBlock,
  classes,
  abilities,
  hits,
  ArmorClass,
  equipment
) {
  return new _character(
    userName,
    name,
    statBlock,
    classes,
    abilities,
    hits,
    ArmorClass,
    equipment
  );
}

class _game {
  constructor(roomName, masterName) {
    this.roomName = roomName;
    this.masterName = masterName;
    this.personalName = masterName + ":" + roomName;
    this.users = [];
    this.characters = [];
    this.messages = [];
  }
}

export function game(roomName, masterName) {
  return new _game(roomName, masterName);
}

game.appendUser = (userName, room) => {
  if (userName != room.masterName && !room.users.includes(userName))
    room.users.push(userName);
};

game.appendCharacter = (characterName, room) => {
  if (
    characterName != room.masterName &&
    !room.characters.includes(characterName)
  )
    room.characters.push(userName);
};

game.appendMessage = (message, room) => {
  room.messages.push(message);
};

class _user {
  constructor(name, password) {
    this.name = name;
    this.password = password;
    this.characters = [];
    this.rooms = [];
  }
}

export function user(name, password) {
  return new _user(name, password);
}

user.appendCharacter = (characterName, user) => {
  if (!user.characters.includes(characterName))
    user.characters.push(characterName);
};

user.deleteCharacrer = (characterName, user) => {
  if (user.characters.includes(characterName))
    user.characters.splice(user.characters.indexOf(characterName), 1);
};

user.enterRoom = (roomName, user) => {
  if (!user.rooms.includes(roomName)) user.rooms.push(roomName);
};

user.exitRoom = (roomName, user) => {
  if (user.rooms.includes(roomName))
    user.rooms.splice(user.rooms.indexOf(roomName), 1);
};

class _message_structure {
  constructor(author, char, mes, room, toMaster, toUser) {
    this.author = author;
    this.char = char;
    this.mes = mes;
    this.room = room;
    this.toMaster = toMaster;
    this.toUser = toUser;
  }
}

export function message_structure(
  author,
  char,
  mes,
  room,
  toMaster = false,
  toUser = ""
) {
  return new _message_structure(author, char, mes, room, toMaster, toUser);
}

//   exitRoom(roomName) {
//     if (this.rooms.includes(roomName))
//       this.rooms.splice(this.rooms.indexOf(roomName), 1);
//   }
