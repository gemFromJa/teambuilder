import React, { ReactElement, useMemo, useState } from "react";
import { Color, colors, ITeam } from "@/types";
import { randomInt } from "@/utils/numbers";
import clsx from "clsx";

import styles from "@/styles/team.module.css";
import { twMerge } from "tailwind-merge";

export default function Teams({
    teams,
    setTeams,
}: {
    teams: ITeam[];
    setTeams: (teams: ITeam[]) => void;
}) {
    const availableColors = useMemo(
        () =>
            colors.filter(
                (color) =>
                    teams.findIndex((team) => team.color === color) === -1
            ),
        [teams]
    );

    const updateTeams = ({
        index = -1,
        name = undefined,
        color = undefined,
    }: {
        index: number;
        name?: string | undefined;
        color?: Color | undefined;
    }) => {
        let _team = [...teams];
        if (name !== undefined) {
            _team[index].name = name;
        }
        if (color !== undefined) {
            _team[index].color = color;
        }
        setTeams(_team);
    };

    const addTeam = () => {
        if (teams.length < colors.length) {
            setTeams([
                ...teams,
                {
                    name: `Team ${teams.length + 1}`,
                    color: availableColors[
                        randomInt(0, availableColors.length - 1)
                    ],
                } as ITeam,
            ]);
        } else {
            // error message
        }
    };

    const removeTeam = (index: number) => {
        if (teams.length === 1) return;

        const _team = [...teams];
        _team.splice(index, 1);
        setTeams(_team);
    };

    return (
        <div>
            <h3 className="text-lg font-semibold">Teams</h3>
            <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] gap-6">
                {teams.map((team, idx) => (
                    <div key={`team_${idx}`} className={` w-[100%] mb-2`}>
                        <div className={`flex justify-between w-[100%]`}>
                            <label>Team Info</label>
                            <div
                                aria-disabled={teams.length <= 2}
                                onClick={() =>
                                    teams.length > 2 && removeTeam(idx)
                                }
                                className="cursor-pointer mx-4"
                            >
                                <img
                                    className="h-[16px]"
                                    src="/images/delete.png"
                                />
                            </div>
                        </div>
                        <div className={`flex gap-3`}>
                            <input
                                className={`px-3 flex-1 border-2 drop-shadow-sm rounded`}
                                value={team.name}
                                onChange={(e) => {
                                    updateTeams({
                                        index: idx,
                                        name: e.target.value,
                                    });
                                }}
                            />
                            <Dropdown
                                selectedColor={team.color as Color}
                                availableColors={availableColors}
                                onSelect={(color) =>
                                    updateTeams({
                                        index: idx,
                                        color: color,
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div
                onClick={addTeam}
                className="inline-flex gap-3 items-center justify-center px-3 cursor-pointer"
            >
                <img src="/images/plus.png" className="h-[16px] inline-block" />
                <span>New Team</span>
            </div>
        </div>
    );
}

const Dropdown = ({
    availableColors,
    selectedColor,
    onSelect,
}: {
    availableColors: Color[];
    onSelect: (color: Color) => void;
    selectedColor: Color;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={clsx(
                `cursor-pointer flex items-center gap-3 relative`,
                open ? styles.open : styles.closed
            )}
            onClick={() => setOpen(!open)}
        >
            <div className="flex gap-3 items-center border-2 w-[87px] px-3 py-2 cursor-pointer">
                <ColorPreview color={selectedColor as Color} />
                <label className={`cursor-pointer`}>
                    {selectedColor ? selectedColor : "color drop down"}
                </label>
            </div>
            <div
                className={`absolute top-[100%] bg-white px-3 py-2 shadow-lg z-20 ${
                    open ? "block" : "hidden"
                }`}
            >
                {availableColors.map((color, key) => (
                    <div
                        key={`color_${key}`}
                        onClick={() => onSelect(color)}
                        className={`grid grid-cols-[10px_auto] items-center gap-2`}
                    >
                        <ColorPreview color={color} />
                        <span className="">{color}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ColorPreview = ({ color }: { color: Color }) => (
    <div
        style={{
            background: color,
        }}
        className={`w-[8px] h-[8px] rounded-full border self-center flex-grow-0`}
    />
);
export function Button({
    onClick,
    text,
    disabled = false,
    className = "",
}: {
    onClick: () => void;
    text: string | ReactElement;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={twMerge(
                `inline-flex items-center justify-center border min-w-[100px] px-4 py-2 rounded-md bg-button-gray cursor-pointer`,
                className
            )}
        >
            {text}
        </button>
    );
}
