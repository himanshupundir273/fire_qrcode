'use client'

import { useWatch, Control, UseFormSetValue, FieldErrors } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { SupportRequestFormData } from '@/lib/validations'

// Item → Model mapping from Notifier product sheet
export const PANEL_CATALOG: Record<string, string[]> = {
  'Fire Alarm Panel (1-4 Loop)':              ['NF5109'],
  'Fire Alarm Panel (1-16 Loop)':             ['NF5000'],
  'Fire Alarm Panel (1 Loop)':                ['NF1'],
  'Fire Alarm Panel':                         ['NF5120'],
  'Fire Alarm Panel (64, 128 & 255 Devices)': ['NF5160'],
  'Smoke Detector':                           ['NF5161', 'NF5131'],
  'Heat Detector':                            ['NF5162', 'NF5142'],
  'Multi Detector':                           ['NF5163', 'NF5167'],
  'Manual Call Point':                        ['NF5264', 'NF5244'],
  'Input Module':                             ['NF5211', 'NF5261'],
  'Control Module':                           ['NF5263', 'NF5265'],
  'Loop Isolator':                            ['NF5260', 'NF5210'],
  'Hooter':                                   ['NF5266', 'NF5270', 'NF5263'],
  'Remote Indicator':                         ['NF5273'],
  'Beam Detector':                            ['TX7130', 'JTY-HM-TX3703'],
  'Dual Input Module':                        ['NF5269'],
  'Loop Extender':                            ['NF6020'],
  'Protocol Transponder (Modbus)':            ['NF5000-RS'],
  'Sounder Base':                             ['NF517S'],
  'Repeater Panel':                           ['NF5862'],
  'Zone Monitoring Interface':                ['NF5272'],
  'Smoke Detector Tester':                    ['NF1000'],
  'Optic Fiber Converter':                    ['NF-Optilink Canbus'],
}

export const ITEM_NAMES = Object.keys(PANEL_CATALOG)

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1">{message}</p>
}

interface Props {
  index: number
  control: Control<SupportRequestFormData>
  setValue: UseFormSetValue<SupportRequestFormData>
  errors: FieldErrors<SupportRequestFormData>
  showRemove: boolean
  onRemove: () => void
}

export function PanelItemRow({ index, control, setValue, errors, showRemove, onRemove }: Props) {
  const selectedItem = useWatch({ control, name: `panels.${index}.item_name` })
  const selectedModel = useWatch({ control, name: `panels.${index}.model` })

  const models = PANEL_CATALOG[selectedItem] ?? []

  const handleItemChange = (value: string) => {
    setValue(`panels.${index}.item_name`, value, { shouldValidate: true })
    // Auto-select model if only one option, otherwise clear
    const newModels = PANEL_CATALOG[value] ?? []
    if (newModels.length === 1) {
      setValue(`panels.${index}.model`, newModels[0], { shouldValidate: true })
    } else {
      setValue(`panels.${index}.model`, '', { shouldValidate: false })
    }
  }

  return (
    <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-700">Panel {index + 1}</span>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Row 1: Item Name + Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedItem || ''} onValueChange={handleItemChange}>
              <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500">
                <SelectValue placeholder="Select item..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
                {ITEM_NAMES.map((name) => (
                  <SelectItem key={name} value={name} className="text-gray-900 hover:bg-red-50 cursor-pointer py-2 px-3">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.panels?.[index]?.item_name?.message} />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Model No. <span className="text-red-500">*</span>
            </Label>
            {models.length > 1 ? (
              <Select
                value={selectedModel || ''}
                onValueChange={(v) => setValue(`panels.${index}.model`, v, { shouldValidate: true })}
                disabled={!selectedItem}
              >
                <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 disabled:opacity-50">
                  <SelectValue placeholder={selectedItem ? 'Select model...' : 'Select item first'} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {models.map((m) => (
                    <SelectItem key={m} value={m} className="text-gray-900 hover:bg-red-50 cursor-pointer py-2 px-3">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={selectedModel || ''}
                readOnly={models.length === 1}
                placeholder={selectedItem ? '' : 'Select item first'}
                className={`mt-1 bg-white ${models.length === 1 ? 'bg-gray-100 text-gray-600 cursor-default' : ''}`}
                onChange={(e) => setValue(`panels.${index}.model`, e.target.value, { shouldValidate: true })}
              />
            )}
            <FieldError message={errors.panels?.[index]?.model?.message} />
          </div>
        </div>

        {/* Row 2: Serial Number + Issue Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Serial Number <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g., SN-2024-XXXXX"
              className="mt-1 bg-white"
              value={useWatch({ control, name: `panels.${index}.serial_number` }) || ''}
              onChange={(e) => setValue(`panels.${index}.serial_number`, e.target.value, { shouldValidate: true })}
            />
            <FieldError message={errors.panels?.[index]?.serial_number?.message} />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Issue Description <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Brief description of the issue"
              className="mt-1 bg-white"
              value={useWatch({ control, name: `panels.${index}.issue_title` }) || ''}
              onChange={(e) => setValue(`panels.${index}.issue_title`, e.target.value, { shouldValidate: true })}
            />
            <FieldError message={errors.panels?.[index]?.issue_title?.message} />
          </div>
        </div>
      </div>
    </div>
  )
}
